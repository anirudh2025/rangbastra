import { getEditorialAssetUrl } from "./editorialAssets.js";

export interface JourneyStep{

    id:number;

    title:string;

    description:string;

    icon:string;

    image:string;

}

const journeyImages = {
    shareYourVision:
        getEditorialAssetUrl("share-your-vision"),

    vision:
        getEditorialAssetUrl("fabric-selection"),

    consultation:
        getEditorialAssetUrl("consultation"),

    craft:
        getEditorialAssetUrl("craft-details"),

    celebration:
        getEditorialAssetUrl("ready-to-be-remembered")
};

export const journey:JourneyStep[]=[

{

id:1,

title:"Share Your Vision",

description:"Tell us about your occasion, inspiration and dream outfit.",

icon:"mirrorWork",

image:journeyImages.shareYourVision

},

{

id:2,

title:"Consult Our Designer",

description:"Discuss fabrics, silhouettes, colours and handcrafted details.",

icon:"designer",

image:journeyImages.consultation

},

{

id:3,

title:"Refine Colour And Measurements",

description:"Palette, proportion and comfort are resolved around you before the detailed work begins.",

icon:"measurements",

image:journeyImages.vision

},

{

id:4,

title:"Crafted With Precision",

description:"Every outfit is individually tailored with exceptional craftsmanship.",

icon:"needle",

image:journeyImages.craft

},

{

id:5,

title:"Final Fitting And Delivery",

description:"Balance, length and finishing are reviewed with care before the piece leaves the atelier.",

icon:"delivery",

image:getEditorialAssetUrl("final-fitting")

},

{

id:6,

title:"Celebrate Beautifully",

description:"Walk into your celebration wearing a piece created exclusively for you.",

icon:"sparkle",

image:journeyImages.celebration

}

];
