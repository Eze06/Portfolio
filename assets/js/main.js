
var VinylElem = document.querySelector(".vinyl");
var VinylFrontElem = document.querySelector(".vinyl-front");
var VinylBackElem = document.querySelector(".vinyl-back");

var TitleElem = document.querySelector("#title");


function FlipVinyl() {
    VinylElem.removeEventListener("mouseenter", PlayVinylHoverTween);
    VinylElem.removeEventListener("mouseleave", ReverseVinylHoverTween);

    gsap.to(TitleElem, { opacity: 0, duration: 0.25, overwrite: "auto" });

    VinylFrontElem.classList.add("is-flipping");

    const tl = gsap.timeline({
        
        defaults: { overwrite: "auto" },

        OnComplete: () =>
        {
            VinylFrontElem.classList.remove("is-flipping");
        }

    });

    tl
        .to(VinylElem, {
        scale: 1.02,
        duration: 1,
        ease: "power2.out"
    })
        
        .to(VinylElem, {
        rotationZ: 0,
        duration: 1
    })
        
        .to(VinylFrontElem, {
        rotationY: -180,
        duration: 1,
        ease: "power2.inOut"
        
    })
        .to(VinylBackElem, {
        rotationY: 180,
        duration: 1,
        ease: "power2.inOut"

    }, "<0.5");
}

//Load Index Page
function LoadIndexPage()
{
    console.log("Loading Index Page");

    const LoadDuration = 1.5;

    gsap.fromTo(VinylElem,
        {
            opacity:0,
        },
        {
            ease: "power1.in",
            opacity: 1,
            duration: LoadDuration,
        }
    )

    gsap.fromTo(TitleElem,
        {
            opacity: 0,
        },
        {
            ease: "power1.in",
            opacity: 1,
            duration: LoadDuration,
        }
    )
}

//Hover for vinyls
const VinylHoverTween = gsap.to(VinylElem, {
    width: "51vh",
    height: "51vh",
    duration: 0.4,
    paused: true,
    overwrite: "auto"
});

function PlayVinylHoverTween() { VinylHoverTween.play(); };

function ReverseVinylHoverTween() { VinylHoverTween.reverse(); };


// //Add event listeners

// //Vinyl Event Listeners
VinylElem.addEventListener('click', FlipVinyl);
VinylElem.addEventListener('mouseenter', PlayVinylHoverTween);
VinylElem.addEventListener('mouseleave', ReverseVinylHoverTween);

LoadIndexPage();