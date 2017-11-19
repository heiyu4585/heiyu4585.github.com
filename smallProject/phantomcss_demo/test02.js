var phantomcss = require('phantomcss');
phantom.casperTest = true;
var fs=require("fs");

casper.test.begin( '测试咖啡', function ( test ) {
    phantomcss.init({
        /*
        captureWaitEnabled defaults to true, setting to false will remove a small wait/delay on each
        screenshot capture - useful when you don't need to worry about
        animations and latency in your visual tests
        */
        captureWaitEnabled: true,

        /*
            libraryRoot is now optional unless you are using SlimerJS where
            you will need to set it to the correct path. It must point to
            your phantomcss folder. If you are using NPM, this will probably
            be './node_modules/phantomcss'.
        */
        // libraryRoot: './modules/PhantomCSS',

        screenshotRoot: './screenshots',

        /*
            By default, failure images are put in the './failures' folder.
            If failedComparisonsRoot is set to false a separate folder will
            not be created but failure images can still be found alongside
            the original and new images.
        */
        failedComparisonsRoot: './failures',

        /*
            Remove results directory tree after run.  Use in conjunction
            with failedComparisonsRoot to see failed comparisons.
        */
        cleanupComparisonImages: true,

        /*
            A reference to a particular Casper instance. Required for SlimerJS.
        */
        // casper: specific_instance_of_casper,

        /*
            You might want to keep master/baseline images in a completely
            different folder to the diffs/failures.  Useful when working
            with version control systems. By default this resolves to the
            screenshotRoot folder.
        */
        comparisonResultRoot: './results',

        /*
            Don't add count number to images. If set to false, a filename is
            required when capturing screenshots.
        */
        addIteratorToImage: false,

        /*
            Don't add label to generated failure image
        */
        addLabelToFailedImage: false,

        /*
            Mismatch tolerance defaults to  0.05%. Increasing this value
            will decrease test coverage
        */
        mismatchTolerance: 0.05,

        /*
            Callbacks for your specific integration
        */
        onFail: function(test){
            console.log("======onFail======");
            console.log(test.filename, test.mismatch);
            },

        onPass: function(test){
            console.log("======onPass======");
            console.log(test.filename);
            },

        /*
            Called when creating new baseline images
        */
        onNewImage: function(){
            console.log("======onNewImage======");
            console.log(test.filename);
            },

        onTimeout: function(){
            console.log("======onTimeout======");
            console.log(test.filename);
        },

        onComplete: function(allTests, noOfFails, noOfErrors){
            allTests.forEach(function(test){
                if(test.fail){
                    console.log("======onComplete======");
                    console.log(test.filename, test.mismatch);
                    console.log("======onoOfFails======");
                    console.log(noOfFails);
                    console.log("======noOfErrors======");
                    console.log(noOfErrors);
                }
            });
        },

        onCaptureFail: function(ex, target) {
            console.log('Capture of ' + target + ' failed due to ' + ex.message);
        },

        /*
            Change the output screenshot filenames for your specific
            integration
        */
        fileNameGetter: function(root,filename){
            // globally override output filename
            // files must exist under root
            // and use the .diff convention
            var name = root+'/somewhere/'+filename;
            if(fs.isFile(name+'.png')){
                return name+'.diff.png';
            } else {
                return name+'.png';
            }
        },

        /*
            Prefix the screenshot number to the filename, instead of suffixing it
        */
        prefixCount: true,

        /*
            Output styles for image failure outputs generated by Resemble.js
        */
        outputSettings: {
            errorColor: {
                red: 255,
                green: 255,
                blue: 0
            },
            errorType: 'movement',
            transparency: 0.3
        },

        /*
            Rebase is useful when you want to create new baseline
            images without manually deleting the files
            casperjs demo/test.js --rebase
        */
        rebase: casper.cli.get("rebase"),

        /*
            If true, test will fail when captures fail (e.g. no element matching selector).
         */
        failOnCaptureError: false
    });


    casper.on( 'remote.message', function ( msg ) {
        this.echo( msg );
    } );

    casper.on( 'error', function ( err ) {
        this.die( ">>>>>PhantomJS has errored: " + err );
    } );

    casper.on( 'resource.error', function ( err ) {
        casper.log( '>>>>>Resource load error: ' + err, '>>>>>warning' );
    } );
    /*
        The test scenario
    */

    casper.start('http://127.0.0.1:8081/');

    casper.viewport( 1024, 768 );

    casper.then( function () {
        phantomcss.screenshot( '#coffee-machine-wrapper', 'open coffee machine button' );
    } );

    casper.then( function () {
        casper.click( '#coffee-machine-button' );

        // wait for modal to fade-in
        casper.waitForSelector( '#myModal:not([style*="display: none"])',
            function success() {
                phantomcss.screenshot( '#myModal', 'coffee machine dialog' );
            },
            function timeout() {
                casper.test.fail( '>>>>>Should see coffee machine' );
            }
        );
    } );

    casper.then( function () {
        casper.click( '#cappuccino-button' );
        phantomcss.screenshot( '#myModal', 'cappuccino success' );
    } );

    casper.then( function () {
        casper.click( '#close' );

        // wait for modal to fade-out
        casper.waitForSelector( '#myModal[style*="display: none"]',
            function success() {
                phantomcss.screenshot( {
                    'Coffee machine close success': {
                        selector: '#coffee-machine-wrapper',
                        ignore: '.selector'
                    },
                    'Coffee machine button success': '#coffee-machine-button'
                } );
            },
            function timeout() {
                casper.test.fail( 'Should be able to walk away from the coffee machine' );
            }
        );
    } );

    casper.then( function now_check_the_screenshots() {
        // compare screenshots
        phantomcss.compareAll();
    } );

    /*
    Casper runs tests
    */
    casper.run( function () {
        console.log( '\nTHE END.' );
        // phantomcss.getExitStatus() // pass or fail?
        casper.test.done();
    } );
} );