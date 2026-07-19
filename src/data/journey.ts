export interface JourneyStep{

    id:number;

    title:string;

    description:string;

    icon:string;

    image:string;

}

const journeyImages = {
    vision:
        "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/RB_Fabric_Swatches_ortjph.webp",

    consultation:
        "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/Consult_Our_Designer_pbxliz.webp",

    craft:
        "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/Crafted_with_Precision_yh1xgw.webp",

    celebration:
        "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/Celebrate_Beautifully_pgr9c6.webp"
};

export const journey:JourneyStep[]=[

{

id:1,

title:"Share Your Vision",

description:"Tell us about your occasion, inspiration and dream outfit.",

icon:"mirrorWork",

image:journeyImages.vision

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

image:journeyImages.consultation

},

{

id:6,

title:"Celebrate Beautifully",

description:"Walk into your celebration wearing a piece created exclusively for you.",

icon:"sparkle",

image:journeyImages.celebration

}

];
