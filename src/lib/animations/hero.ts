import gsap from "gsap";

export function initHeroAnimation() {

    const tl = gsap.timeline({

        defaults:{
            ease:"power3.out"
        }

    });

    tl

    .from(".hero-eyebrow",{

        y:30,
        opacity:0,
        duration:.6

    })

    .from(".hero-title",{

        y:50,
        opacity:0,
        duration:.9

    },"-=.3")

    .from(".hero-description",{

        y:35,
        opacity:0,
        duration:.7

    },"-=.5")

    .from(".hero-actions",{

        y:25,
        opacity:0,
        duration:.6

    },"-=.45")

    .from(".hero-image",{

        scale:1.08,
        opacity:0,
        duration:1.2

    },"-=.8");

}