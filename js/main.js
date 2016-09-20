$(function () {
    var container, stats;

    var camera, scene, renderer;

    var mouseX = 0, mouseY = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    var monster = null;
    var onProgress = null;
    var onError = null;

    init();
    animate();
    function init() {

        container = document.getElementById( 'container' );

        camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.z = 250;

        // scene
        scene = new THREE.Scene();

        var ambient = new THREE.AmbientLight(  0xFFFFFF  );
        scene.add( ambient );

       var directionalLight = new THREE.DirectionalLight( 0xFFFFFF );
       directionalLight.position.set( 1, 1, 1 ).normalize();
       scene.add( directionalLight );

        // model
        onProgress = function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round(percentComplete, 2) + '% downloaded' );
            }
        };

        onError = function ( xhr ) { };

        THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

        mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath( 'texture_models/' );
        mtlLoader.load($(".item").first().text() + '.obj.mtl', function( materials ) {

            materials.preload();

            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.setPath( 'texture_models/' );
            objLoader.load($(".item").first().text() + '.obj', function ( object ) {
                object.scale.set( 20, 20, 20 );
                object.position.y = - 95;
                monster = object;
                scene.add( object );

            }, onProgress, onError );

        });

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );

        document.addEventListener( 'mousemove', onDocumentMouseMove, false );

        window.addEventListener( 'resize', onWindowResize, false );

    }

    function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function onDocumentMouseMove( event ) {

        mouseX = ( event.clientX - windowHalfX ) / 2;
        mouseY = ( event.clientY - windowHalfY ) / 2;

    }


    function animate() {

        requestAnimationFrame( animate );
        render();
    }

    function render() {

        camera.position.x += ( mouseX - camera.position.x ) * .05;
        camera.position.y += ( - mouseY - camera.position.y ) * .05;

        camera.lookAt( scene.position );

        renderer.render( scene, camera );
    }


    $(".item").click(function () {
        if(monster) {
            scene.remove(monster);
            var mon = $(this).text();
            var mtlLoader = new THREE.MTLLoader();
            mtlLoader.setPath( 'texture_models/' );
            mtlLoader.load(mon + '.obj.mtl', function (materials) {
                materials.preload();
                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.setPath('texture_models/');
                objLoader.load(mon + '.obj', function (object) {
                    object.scale.set(25, 25, 25);
                    object.position.y = -95;
                    monster = object;
                    scene.add(object);

                }, onProgress, onError);

            });
            animate();
        }
    });


});