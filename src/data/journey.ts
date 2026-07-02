export interface JourneyStep{

    id:number;

    title:string;

    description:string;

    icon:string;

    image:string;

}

const defaultJourneyImage =
"https://res.cloudinary.com/dfxlm7z58/image/upload/f_auto,q_auto,dpr_auto,c_fill,w_900,h_1200,g_auto/v1782458746/RB_Hero_v7dyxg.png";

export const journey:JourneyStep[]=[

{

id:1,

title:"Share Your Vision",

description:"Tell us about your occasion, inspiration and dream outfit.",

icon:"sparkles",

image:defaultJourneyImage

},

{

id:2,

title:"Consult Our Designer",

description:"Discuss fabrics, silhouettes, colours and handcrafted details.",

icon:"needle",

image:defaultJourneyImage

},

{

id:3,

title:"Crafted With Precision",

description:"Every outfit is individually tailored with exceptional craftsmanship.",

icon:"thread",

image:defaultJourneyImage

},

{

id:4,

title:"Celebrate Beautifully",

description:"Walk into your celebration wearing a piece created exclusively for you.",

icon:"crown",

image:defaultJourneyImage

}

];
