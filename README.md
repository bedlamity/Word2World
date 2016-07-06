# Word2World
This is a multi-pronged attempt to convert flat, boring HTML pages and websites into 3D virtual worlds, automagically.

Hi All!

Okay I am very excited about this topic, much to the bemusement of my family. My feeling is that in the future, at some point, in some way, we will be interacting in 3D virtual worlds. You can see that this age is coming upon us with the Oculus Rift, HoloLens, and Samsung VR that are making their appearances. However we have a huge backlog of normal webpages just waiting to be accessed in this brave new world. Take GitHub: this website is so awesome, so entertaining and so full of great content that people wearing an Oculus Rift deserve, nay, need, to have access to it. Not only do they need access to it, but wouldn't it be neat if it blended in seamlessly with their world? And as a content creator, wouldn't it be great if this happened automatically? I know I am a lazy guy, and I love making computers do all of the work, so lets automate this procedure.

I feel like the key to extending how normal web pages are displayed in virtual reality (VR) is to extend the concept of CSS. In normal web pages, you have three parts to a web document. You have the HTML, the CSS, and JavaScript. When you load a page, you are generally loading in at least two files. You load in an HTML file with all the text of the page. This file also contains some hints about the meaning of this text. You might say this over here is a header, and this chunk of text is a paragraph, and oh by the way, this word needs to be bold. However in this HTML file you don't really describe stuff like what font to use, and how big the text is, and so on. Instead the second file, the CSS file, describes in general terms the look of the page. So it says, today we are feeling extravagant, and all paragraphs must be in flowing Arabic script with a fuscia color. However we want all titles (headers) to be in San Serif, with a font size of 42. So the rendering engine in your web browser would apply these requests to the HTML you sent it as best as it can. It might laugh at you for asking for paragraphs to be written using the Arabic font, because it knows you don't understand that font, but it will keep its comments to itself. The next day, maybe your sanity returns and you decide to put the whole article in sensible Times Roman and make it all black. This is boring, but sensible, and your web browser silently approves. All you would do is replace the CSS file with a better one, and specify in there that all headers and all paragraphs should use the font Times Roman.

There is also a third part we are feeding the web engine, and that is JavaScript. There are also other files, like pictures and videos that need to be loaded separately, but I am completely ignoring these for the moment. JavaScript is extremely useful when you want to change the page on the fly. So what you need is a file where you can write code. You can write "if" statements and other delicious codey things to make some decisions even after the people have loaded the page. Maybe you want to give your users the ability to switch the text between fuscia-colored Arabic font and black Times Roman font on the fly. So when they click a button, your JavaScript interprets what they are asking to do, and updates the CSS instructions inside the web browser. It notices you are currently using Arabic, and switches over all the paragraphs to the font Times Roman. This is important to understand: the JavaScript pokes the web browser and not the actual words on your screen. It is still the responsibility of the web browser to interpret the current HTML and CSS, with all of the modifications your JavaScript applied, and update what you are seeing on the screen by interacting with your graphics card.

Recently web browsers have begun to support 3D content. However they do this by a different mechanism. In this scenario, the CSS file is almost completely ignored. Whenever the rendering engine finds an HTML file that mentions a "canvas," it knows this is supposed to be, well, a blank canvas. It reserves this space for 3D content creation. In this case, the link between the logic block and the graphics card is much more direct. They have provided a way for JavaScript to hook into the card and issue instructions. They did this because 3D graphics are very resource intensive and are hard to do any other way. You will just have to trust me on this point, but JavaScript is an interpreted language and is not fast enough to be able to handle all of the calculations required to do 3D without these low level graphics card hooks. So this is really awesome and opens up all sorts of possibilities for web designers to do 3D content and add all sorts of visualizations that otherwise wouldn't be possible.

I don't really want this low level access to be removed; I liked being given the full power to tap deep down when needed. However it would be really nice to be able to use a type of CSS, a type of format specifications, a type of shorthand if you will, when the occasion calls for it. I would like there to be a way to tell the web browser engine, that, hey, we are doing 3D here, so take this text and this picture, and generate the appropriate museum/ storefront, etc. from it. So if we did this right, we could one day choose to display everything in fuscia-colored Arabic font and display our webpage in the normal 2D way. But then the next day, we could supply what I am calling an "S3D" file and display the exact same HTML text, but in a 3D museum style. In this file we would ask the rendering engine in the web browser to display the contents of a single web page in one room in our museum, with the entire website being housed in a virtual museum. Then we ask that all paragraphs it finds be displayed in their own billboard, placed around the room one after the other. We would also tell the renderer that we would like all photos to be displayed in art frames. On top of that, we might specify what type of frame we are wanting. So one day might be all art deco frames, and another day might be all clean, modern frames. In this way, your average, over-worked, underpaid blogger can write content once, and be able to reach both the people on their mobile phone as well as the people using the Oculus Rift, and give the same content to them in a way that is appropriate to their device with a look that is both easy to create and easy to change, all without really adding to their burden!

For now, I don't have the skill or the access to the innards of Firefox or Internet Explorer or any other web browser to add the improvements I am needing. So I am working towards an intermediate step. I can still describe and perfect the S3D file format I am needing. But I will use the back-end server, along with JavaScript and the package BabylonJS as a workaround. They can generate and interpret this file, and so I can play around with what exactly an S3D sheet should contain, and really test how the system works in practice. This will work out just fine, and I never really need the browsers to adopt the technology. However I will keep this browser possibility in mind while designing the system. Then if it all looks good, hopefully the idea will take off and get added to the browsers and life will be grand. For starters, the system will allow web pages, particularly Word Press pages,to reach the VR world.


I will show you the S3D file proposal in a second, but first here is what a very basic HTML looks like:


     <!DOCTYPE html>

    <html>

    <head>

    <title>Page Title</title>

    </head>

    <body>


    <h1>This is a Heading</h1>

    <p>This is a paragraph.</p>


    </body>

    </html>


Do you notice the meta-tags like the "h1" and "p" stuff? This is how your browser is told what is a paragraph and what is a header.

Now here is a CSS file:

    body {

    background-color: #d0e4fe;

    }


    h1 {

    color: orange;

    text-align: center;

    }


    p {

    font-family: "Times New Roman";

    font-size: 20px;

    }

Do you see how the CSS file is just guidelines? There is a "p" section that corresponds to the paragraph in the HTML section. So your browser knows that we want all paragraphs to be of font type "Times New Roman", at 20 pixels high. Or if you really want fuscia and Arabic, this is where you would change things. It's sort of mind-blowing to separate things like this, but hopefully you can see the power of it.

And so finally, here is what I am proposing; what I am affectionately calling S3D (Styling Three Dimensions):

    body {

    container: room;

    }

    p {

    container: billboard;

    }

    image {

    container: "art frame";

    }

    room {

    color: brown;

    size: auto

    }

    website {

    container: museum;

    }

    art frame {

                style: "art deco"

    }

    billboard{

               style:"simple"

    }

Do you see my "p" up there? I am asking the rendering system to put each paragraph in a billboard. Do you see the image specification in there as well? I am requesting that all images be put in an art frame, and so on.

This S3D file is completely made up at the moment by me. But in the next little while I will continue to flesh this out using BabylonJS as one way to render.

So, are you as excited as I am? No? That's okay. I hope you at least got nice and drowsy and ready to go to sleep for the night. Sleep well!
