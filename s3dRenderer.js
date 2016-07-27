//This file is designed to work with Babylon JS.
//While Babylon is an all-purpose game engine, in this particular incarnation,
//we are using it to take an HTML page and turn it into a 3D room.
//It is designed to work in tandem with the file s3dParser.js.

window.addEventListener('DOMContentLoaded', () => {
    var canvas = document.getElementById('renderCanvas');

    var engine = new BABYLON.Engine(canvas, true);

    //This function makes use of the S3D style sheet to parse an HTML fragment
    //and turn it into a scene. So for example, a museum room complete with text and pictures.
    var createScene = function () {
        var scene = new BABYLON.Scene(engine);

        //var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
        var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(200, 500, 1200), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, false);

        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

        //var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);

        var faceColors = new Array(6);
        faceColors[4] = new BABYLON.Color4(1, 0, 0, 1);
        faceColors[0] = new BABYLON.Color4(0, 1, 0, 1);
        faceColors[1] = new BABYLON.Color4(0, 1, 0, 1);
        faceColors[2] = new BABYLON.Color4(0, 1, 0, 1);
        faceColors[3] = new BABYLON.Color4(0, 1, 0, 1);
        faceColors[5] = new BABYLON.Color4(0, 1, 0, 1);

        var options = {
            width: 3,
            height: 4,
            depth: 5,
            faceColors: faceColors
        }

        //var wall = BABYLON.MeshBuilder.CreateBox("wall", options, scene);
        //var box1 = BABYLON.Mesh.CreateBox("box1",  1, scene);
       // wall.position = new BABYLON.Vector3(0, 0, 0);
        //var i = 1;
       // wall.position.x = i * 2;
        //wall.rotation.x = Math.PI / i;

        var s3d = new S3d();
        s3d.constructOneRoom({ htmlFileName: "TestFragment2.html" }, scene);
        //s3d.createDomTree();
        //s3d.create3dStructures(scene);

        return scene;
    }

    //var htmlFragment = "<p>Hello World.</p><p>This is your captain speaking.</p><p>Buckle up and enjoy the ride!</p><p>Paragraph 4</p>";
    //var s3dFile = "body{container: room;}" +
   //     "p{container: billboard;}";
    
    //s3d.loadHtml("TestFragment2.html");
    //s3d.createDomTree();
    //var walls = s3d.create3dStructures();


    var scene = createScene();

    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener('resize', () => {
        engine.resize();
    });
});


/*
window.addEventListener('DOMContentLoaded', () => {
    // get the canvas DOM element
    //var canvas = <HTMLCanvasElement>document.getElementById('renderCanvas');
    var canvas = document.getElementById('renderCanvas');

    // load the 3D engine
    var engine = new BABYLON.Engine(canvas, true);

    // createScene function that creates and return the scene
    var createScene = function() {
        // create a basic BJS Scene object
        var scene = new BABYLON.Scene(engine);

        // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
        var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5,-10), scene);

        // target the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // attach the camera to the canvas
        camera.attachControl(canvas, false);

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

        // create a built-in "sphere" shape; its constructor takes 5 params: name, width, depth, subdivisions, scene
        var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);

        // move the sphere upward 1/2 of its height
        sphere.position.y = 1;

        // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
        var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);

        // return the created scene
        return scene;
    }

    // call the createScene function
    var scene = createScene();

    // run the render loop
    engine.runRenderLoop(() => {
        scene.render();
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', () => {
        engine.resize();
    });
});*/