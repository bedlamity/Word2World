//The object created from this file takes an HTML fragment,
//combines it with an S3D file, and creates a specialized document object model
//tree. 
//Once this tree is created, another method parses through it and generates the 3D
//structure that will be visible in the world.


//Version 1: very stripped down.
//It can accept four, and only four, paragraphs.
function S3d() {
    this.htmlDocument;
    this.s3dFile;
    //this.elements; //An array that comes form htmlfragment split into paragraphs
    this.texts; //comes from the elements array, where each string is formatted for wordwrap
    this.walls;
}

//files.htmlFileName, 
//files.s3dFileName;
S3d.prototype.constructOneRoom = function (files, scene) {
    var htmlDocument = this.loadHtml(files.htmlFileName);
    var blocks = this.createArrayOfAllParagraphsNicelyFormatted(htmlDocument, 30); //number of chars will eventually come from files.s3dFileName...
    //this.texts = blocks;
    this.create3dStructures(blocks, 30, scene);
}

//So this is where we create the walls and floor, and then paste the HTML words on the walls.
//parameters:
//blocks: the formatted text we will display on the wall.
//maxNumOfCharsInOneLine: to help decide how wide each rect2D canvas should be.
//scene: a reference to the actual babylon scene, so that we can put the stuff directly in the world.
S3d.prototype.create3dStructures = function (blocks, maxNumOfCharsInOneLine, scene) {
    var widthOfOneBlock = maxNumOfCharsInOneLine * 50;
    var wallWidthShortWall = widthOfOneBlock * 2;

    //Just calculating how long the long wall should be. If it is too short, then we just arbitrarily make it big enough so that it looks like a proper room.
    var numOfBlocksOnLongWall = blocks.length - 4;
    if (numOfBlocksOnLongWall <= 0) {
        numOfBlocksOnLongWall = 2;
    }
    var wallWidthLongWall = widthOfOneBlock * numOfBlocksOnLongWall; //long wall is variable length. Long enough to accomodate all text blocks, minus the ones on the short walls;
    var wallHeight = 800;
    var wallThickness = 50;

    //var wallWidthShortWall = 1500;
    //var wallWidthLongWall = 2000;
    //var wallHeight = 800;
    //var wallThickness = 50;



    this.createTheRoom({ wallWidthShortWall: wallWidthShortWall, wallWidthLongWall: wallWidthLongWall, wallHeight: wallHeight, wallThickness: wallThickness }, scene, blocks);


}

//So we have to create walls and a floor of some dimensions or another so that we can plaster words and pictures on the walls.
//parameters:
//dimensions.wallWidthShortWall //two side walls
//dimensions.wallWidthLongWall //back wall
//dimensions.wallHeight
//dimensions.wallThickness
//scene:  a reference to the actual babylon scene, so that we can put the stuff directly in the world.
S3d.prototype.createTheRoom = function (dimensions, scene, blocks) {
    var faceColors = new Array(6);
    faceColors[4] = new BABYLON.Color4(1, 0, 0, 1);
    faceColors[0] = new BABYLON.Color4(0, 1, 0, 1);
    faceColors[1] = new BABYLON.Color4(0, 1, 0, 1);
    faceColors[2] = new BABYLON.Color4(0, 1, 0, 1);
    faceColors[3] = new BABYLON.Color4(0, 1, 0, 1);
    faceColors[5] = new BABYLON.Color4(0, 1, 0, 1);

    //In our museum, we will always have 3 walls, with the fourth one that is missing backing out into the main atrium (at least for now).
    //The two walls connected to the atrium will be shorter, but of the same length. The third wall opposite the opening
    //will be likely longer. In the end, it will be as long as needed to contain the text.

    var optionsShortWall = {
        width: dimensions.wallWidthShortWall,
        height: dimensions.wallHeight,
        depth: dimensions.wallThickness,
        faceColors: faceColors
    }

    var optionsLongWall = {
        width: dimensions.wallWidthLongWall,
        height: dimensions.wallHeight,
        depth: dimensions.wallThickness,
        faceColors: faceColors
    }

    //There is a ground mechanism in Babylon, but I think we need a real floor for our purposes.
    //I'm not putting a roof on it for now.
    var optionsFloor = {
        width: dimensions.wallWidthShortWall,
        height: dimensions.wallThickness,
        depth: dimensions.wallWidthLongWall,
        faceColors: faceColors
    }

    this.walls = [];

    var billboards = []; //This will contain all of the places to put blocks of text. Really these are the Text2D objects, at least for now.
                         //Maybe in the future some of them will be image place holders.
                         //NOTE: The text will be inserted elsewhere.
    var shortWallrightSide = BABYLON.MeshBuilder.CreateBox("shortWallrightSide", optionsShortWall, scene);
    //y is the up and down line - how high above the ground. I find that the box gets naturally centered around
    //(0,0,0), meaning that half of it is below ground...
    shortWallrightSide.position = new BABYLON.Vector3(0, optionsShortWall.height / 2, 0);
    shortWallrightSide.rotation.y = 0;
    var canvasRightSide = new BABYLON.WorldSpaceCanvas2D(scene, new BABYLON.Size(optionsShortWall.width, optionsShortWall.height), {
        id: "shortWallRightSideCanvas",
        worldPosition: new BABYLON.Vector3(0, optionsShortWall.height / 2, dimensions.wallThickness/2 + 1),
        worldRotation: BABYLON.Quaternion.RotationYawPitchRoll(Math.PI, 0, 0), //Math.Pi Rotation is 180 degrees
        renderScaleFactor: 1,
        enableInteraction: true,
        backgroundFill: "#40C040FF",
        backgroundRoundRadius: 0,
        children:
        [
            new BABYLON.Text2D(blocks[2], { fontName: "30pt Arial", marginAlignment: "h: center, v: center" }),
        ]
    });
    this.walls.push(shortWallrightSide);

    var shortWallLeftSide = BABYLON.MeshBuilder.CreateBox("shortWallLeftSide", optionsShortWall, scene);
    shortWallLeftSide.position = new BABYLON.Vector3(0, optionsShortWall.height / 2, optionsLongWall.width);
    shortWallLeftSide.rotation.y = 0;
    var canvasLeftSide = new BABYLON.WorldSpaceCanvas2D(scene, new BABYLON.Size(optionsShortWall.width, optionsShortWall.height), {
        id: "shortWallLeftSideCanvas",
        worldPosition: new BABYLON.Vector3(0, optionsShortWall.height / 2, optionsLongWall.width - dimensions.wallThickness / 2 - 1),
        worldRotation: BABYLON.Quaternion.RotationYawPitchRoll(0, 0, 0), //Math.Pi Rotation is 180 degrees
        renderScaleFactor: 1,
        enableInteraction: true,
        backgroundFill: "#40C040FF",
        backgroundRoundRadius: 0,
        children:
        [
            new BABYLON.Text2D(blocks[0], { fontName: "30pt Arial", marginAlignment: "h: left, v: top", margin: "top: 5, left: 10, right: 15, bottom: 20" }),
        ]
    });
    this.walls.push(shortWallLeftSide);

    var backWall = BABYLON.MeshBuilder.CreateBox("backWall", optionsLongWall, scene);
    backWall.position = new BABYLON.Vector3((optionsShortWall.width / 2) + (optionsShortWall.depth / 2), optionsLongWall.height / 2, optionsLongWall.width / 2);
    backWall.rotation.y = Math.PI / 2; //perpendicular
    var canvasBackWall = new BABYLON.WorldSpaceCanvas2D(scene, new BABYLON.Size(optionsLongWall.width, optionsLongWall.height), {
        id: "backWallCanvas",
        worldPosition: new BABYLON.Vector3((optionsShortWall.width / 2) - (optionsShortWall.depth / 2), optionsLongWall.height / 2, optionsLongWall.width / 2),
        worldRotation: BABYLON.Quaternion.RotationYawPitchRoll(Math.PI / 2, 0, 0), //Math.Pi Rotation is 180 degrees
        renderScaleFactor: 1,
        enableInteraction: true,
        backgroundFill: "#40C040FF",
        backgroundRoundRadius: 0,
        children:
        [
            new BABYLON.Text2D(blocks[1], { fontName: "30pt Arial", marginAlignment: "h: center, v: center" }),
        ]
    });
    this.walls.push(backWall);

    var floor = BABYLON.MeshBuilder.CreateBox("floor", optionsFloor, scene);
    floor.position = new BABYLON.Vector3(0, optionsShortWall.depth / 2, optionsLongWall.width / 2);
    floor.rotation.y = 0;
}

//This method grabs a file (likely an HTML file, or possibly an S3D file)
//from the server and returns it.
//So the idea is to then parse it elsewhere and from that begin to construct the building
S3d.prototype.retrieveFileFromServer = function (filename){
    //JQuery would be a possibility here    
    var xmlHttp;
    try
    {
        xmlHttp = new XMLHttpRequest();
        console.warn("Making XMLHttpRequest...");
    } 
    catch (e) 
    {
        console.warn("XMLHttpRequest failed: " + e.toString());
        try
        {
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e)
        {
            try
            {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e)
            {
                alert("Error loading files! Possibly your browser does not support AJAX. Unfortunately this means the 3D world cannot be constructed... Please try again with a modern browser like Chrome or Firefox.");
            }
        }
    }

    request = xmlHttp;
    if (request != null) {
        request.open("GET", filename, false); //false means synchronously - wait here until it is fully loaded. This could be bad later if it ever got stuck.
        request.send();
    }
    return request.responseText;
}

S3d.prototype.loadHtml = function (filename) {
    var htmlDocument = this.retrieveFileFromServer(filename);
    console.warn("loading text file " + filename + ". Contents:");
    console.warn(htmlDocument);
    return htmlDocument;
}

//This method is fairly important, in that it slices up the html fragment into
//the blocks that will be displayed in the room. So, for now it slices up
//based only on paragraphs (more block types available later), and after applying the
//word wrap formatting, it returns an array of text blocks. So then it makes sense to 
//call this method before creating the walls, because you may need to expand the wall
//if there are a lot of paragraphs.
//fields:
//htmlFragment: this is likely the entire HTML page we are displaying in one room.
//maxNumOfCharsInOneLine: how many characters are allowed in one line, not including the EOL character.
//returns:
//blocks: an array of text blocks that make up the HTML fragment, all nicely
//formatted to be displayed properly on the wall.
S3d.prototype.createArrayOfAllParagraphsNicelyFormatted = function (htmlFragment, maxNumOfCharsInOneLine) {
    var blocks = this.createNicelyFormattedTextBlocks(htmlFragment, "p", 30);
    return blocks;
}


//This method is an initial attempt at parsing HTML. For now, it can only search based off of one
//element type (likely paragraphs to start with). So, for example, it currently ignores images.
//It returns a nice array that can be used to write on the 2D canvases, since it applies the
//word wrap formatting as well.
//fields:
//htmlDocument: this is the page loaded from the server that will be represented as a 3D room.
//blockType: so the HTML element type we will split the document up by. Yeah, yeah, later we need to account for things like images.
//maxNumOfCharsInOneLine: how many characters are allowed in one line, not including the EOL character.
//returns:
//blocks: an array that is ready to be applied to 2D canvases and displayed.
S3d.prototype.createNicelyFormattedTextBlocks = function (htmlDocument, blockType, maxNumOfCharsInOneLine) {
    console.debug("Creating DOM tree from html...");
    var text = document.createElement('html');
    text.innerHTML = htmlDocument;
    var elements = text.getElementsByTagName(blockType);
    var blocks = [];
    for (var i = 0; i < elements.length; i++) {
        var block = this.parseForWordWrap(elements[i].innerText, maxNumOfCharsInOneLine);
        blocks.push(block);
    }
    return blocks;
}

//So in the 3D canvas, when writing text on a surface in there, Babylon is
//not great about word-wrapping, from what I can see.
//If there is a linefeed character, then it will happily start a new line. 
//But if there isn't one, then it just keeps on going, and will likely have some cut 
//off at the end. So the job is to split the text up into words, and then only
//add words until some count has been reached, and then start a new line.
//There could be missing blank-space issues with rendering it in this fashion, but
//I think it is a reasonable first attempt. 
//For the minute, I am not going to get too hung up on exact character sizes and all.
//I just want a rough word wrap, in one font, in one size, just to get things going.
//parameters:
//text: a long string that may or may not need word wrapping applied
//maxNumOfCharsInOneLine: how many characters are allowed in one line, not including the EOL character.
//return value:
//formattedText: This will return one long string, but the string will have the line feeds inserted
//at the correct places, ready to be displayed properly in a BABYLON.WorldSpaceCanvas2D
S3d.prototype.parseForWordWrap = function (text, maxNumOfCharsInOneLine) {
    var wordArray = text.split(" "); //TODO - check for more than just space separators: use regular expression
    var totalNumOfChars = 0;
    var formattedText = "";
    console.debug("maxNumOfCharsInOneLine: " + maxNumOfCharsInOneLine.toString() + "; text: " + text);
    
    wordArray.forEach(function (word) {
        console.debug("word: " + word);
        if ((totalNumOfChars + word.length) > maxNumOfCharsInOneLine) {
            console.debug("new line inserted...");
            formattedText += String.fromCharCode(10); //ascii line feed. Apparently this is what the Babylon text function really likes...
            totalNumOfChars = 0;
        }
        totalNumOfChars += word.length + 1; //the + 1 is to take care of counting the space after the word.
        formattedText += " " + word;
    });
    console.debug("new formatted text: " + formattedText);
    return formattedText;
}

  /*  for (var i = 0, max = this.elements.length; i < max; i++) {
        //var wall = BABYLON.Mesh.CreateBox("box", { height: 5, width: 5, depth: 1 }, scene);
        console.warn("number of elements: " + max);
        
        var faceColors = new Array(6);
        faceColors[4] = new BABYLON.Color4(1, 0, 0, 1);
        faceColors[0] = new BABYLON.Color4(0, 1, 0, 1);
        faceColors[1] = new BABYLON.Color4(0, 1, 0, 1);
        faceColors[2] = new BABYLON.Color4(0, 1, 0, 1);
        faceColors[3] = new BABYLON.Color4(0, 1, 0, 1);
        faceColors[5] = new BABYLON.Color4(0, 1, 0, 1);

        var options = {
            width: .1,
            height: 3,
            depth: 3,
            faceColors: faceColors
        }



        var wall = BABYLON.MeshBuilder.CreateBox("wall" + i.toString(), options, scene);
        wall.position = new BABYLON.Vector3(0, 0, 0);
        
        if (i % 2 == 0)
        {
            if (i > 1) {
                wall.position.x = -1.5;
                wall.position.z = 0;
                console.warn("In one");
            }
            else {
                wall.position.x = 1.5;
                wall.position.z = 0;
                console.warn("In two");
            }
        }
        else
        {
            if (i > 1) {
                wall.position.x = 0;
                wall.position.z = 1.5;
                console.warn("In three");
            }
            else {
                wall.position.x = 0;
                wall.position.z = -1.5;
                console.warn("In four");
            }
        }
        wall.rotation.y = (i / 2) * Math.PI;*/

        

       /* var canvas = new BABYLON.ScreenSpaceCanvas2D(scene, {
            id: "ScreenCanvas" + i,
            size: new BABYLON.Size(300, 100),
            backgroundFill: "#C0C0C040",
            backgroundRoundRadius: 80,
            children: [
                new BABYLON.Text2D(this.elements[i], {
                    fontName: "30pt Arial",
                    marginAlignment: "h: center, v: bottom",
                    id: "text" + i.toString()
                })
               ]
        });*/

        //walls.push(wall);
  //  }
 /*   var canvas = new BABYLON.ScreenSpaceCanvas2D(scene, {
        id: "ScreenCanvas" + i,
        size: new BABYLON.Size(300, 100),
        backgroundFill: "#C0C0C040",
        backgroundRoundRadius: 80,
        children: [
            new BABYLON.Text2D(this.elements[i], {
                fontName: "30pt Arial",
                marginAlignment: "h: center, v: bottom",
                id: "text" + i.toString()
            })
        ]
    });*/
 /*   var canvas = new BABYLON.WorldSpaceCanvas2D(scene, new BABYLON.Size(400, 400), {
        id: "WorldSpaceCanvas",
        worldPosition: new BABYLON.Vector3(0, 0, 0),
        worldRotation: BABYLON.Quaternion.RotationYawPitchRoll(Math.PI / 4, Math.PI / 4, 0),
        renderScaleFactor: 8,
        enableInteraction: true,
        backgroundFill: "#0C0C0C040",
        backgroundRoundRadius: 80,
        children: [
            new BABYLON.Text2D(this.elements[0].innerText.toString(), { fontName: "5pt Arial", marginAlignment: "h: center, v: bottom" })//new BABYLON.Text2D("World Space Canvas", { fontName: "5pt Arial", marginAlignment: "h: center, v: bottom" })
        ]
    });
     
    var rect = new BABYLON.Rectangle2D(
        {
            parent: canvas, x: 80, y: 80, width: 200, height: 200, fill: null,
            border: BABYLON.Canvas2D.GetGradientColorBrush(new BABYLON.Color4(0.9, 0.3, 0.9, 1), new BABYLON.Color4(1.0, 1.0, 1.0, 1)),
            borderThickness: 20,
            children:
            [
                new BABYLON.Rectangle2D(
                    {
                        parent: rect, width: 100, height: 100, marginAlignment: "h: center, v: center",
                        fill: "#0040F0FF", roundRadius: 20
                    })
            ]
        });

    var buttonRect = new BABYLON.Rectangle2D(
        {
            parent: canvas, id: "button", x: 100, y: 100, width: 200, height: 80, fill: "#40C040FF",
            roundRadius: 10,
            children:
            [
                new BABYLON.Text2D("Click Me!", { fontName: "30pt Arial", marginAlignment: "h: center, v: center" })
            ]
        });

    var button2Rect = new BABYLON.Rectangle2D(
    {
        parent: canvas, id: "button2", x: 110, y: 110, width: 200, height: 80, fill: "#40C040FF",
        roundRadius: 10, isVisible: false,
        children:
        [
            new BABYLON.Text2D(this.elements[0].innerText.toString(), { fontName: "30pt Arial", marginAlignment: "h: center, v: center" })
        ]
    });

    buttonRect.pointerEventObservable.add(function (d, s) {
        button2Rect.levelVisible = !button2Rect.levelVisible;
        console.warn("button clicked");
    }, BABYLON.PrimitivePointerInfo.PointerUp);

    var timerId = setInterval(function () {
        if (rect.isDisposed) {
            clearInterval(timerId);
            return;
        }
        rect.rotation += 0.01;
    }, 10);*/
//}