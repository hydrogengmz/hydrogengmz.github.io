function getCookie(cookieName) {
    return localStorage.getItem(cookieName);
}

function keyCheck(placeholder) {
    if (!getCookie("nasakey")) {
        console.log("No API key found. Prompting user for input.");
        const apikey = prompt(
            "Please enter your NASA API key to be saved locally:",
            placeholder
        );

        if (apikey) {
            localStorage.setItem("nasakey", apikey);
            console.log("API key saved to localStorage.");
        } else {
            console.log("No API key provided. Skipping data fetching.");
            throw new Error("API key is required.");
        }
    } else {
        console.log("API key already exists in localStorage.");
    }
}

keyCheck("");

// Fetch NASA APOD data
fetch(`https://api.nasa.gov/planetary/apod?api_key=${getCookie("nasakey")}`)
    .then((response) => response.json())
    .then((data) => {
        const title = document.getElementById("nTitle");
        const img = document.getElementById("nasaImg");
        const bginfo = document.getElementById("bgInfoNasa");

        title.innerHTML = data.title;
        bginfo.innerHTML = data.explanation;

        // Check if the URL is for a YouTube video or an image
        if (data.url.includes("youtube.com") || data.url.includes("youtu.be")) {
            console.log("APOD content is a YouTube video:", data.url);

            // Modify the URL to autoplay, mute, and loop the video
            let videoUrl = new URL(data.url);
            videoUrl.searchParams.set("autoplay", "1"); // Autoplay
            videoUrl.searchParams.set("mute", "1"); // Mute the video
            videoUrl.searchParams.set("controls", "0"); // Remove controls
            videoUrl.searchParams.set("loop", "1"); // Loop the video

            // Handle embedding based on YouTube URL format
            if (data.url.includes("watch?v=")) {
                const videoId = videoUrl.searchParams.get("v");
                videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}`;
            }

            // Create an iframe to embed the video
            const videoIframe = document.createElement("iframe");
            videoIframe.setAttribute("src", videoUrl.toString());
            videoIframe.style = "width: 80%; aspect-ratio: 16/ 9;";
            videoIframe.setAttribute("frameborder", "0");
            videoIframe.setAttribute(
                "allow",
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            );
            videoIframe.setAttribute("allowfullscreen", true);
            videoIframe.classList.add("videoIframe");

            img.replaceWith(videoIframe); // Replace the image element with the iframe

            // Make the title clickable and redirect to the YouTube video
            title.style.cursor = "pointer"; // Add pointer cursor
            title.style = 'color: dodgerblue;'
            title.addEventListener("click", function () {
                window.open(data.url, "_blank"); // Open YouTube video in a new tab
            });
        } else {
            console.log("APOD content is an image:", data.url);
            img.setAttribute("src", data.url);
        }
    })
    .catch((error) => console.error("Error fetching APOD data:", error));

// Fetch latest Mars photos for the selected rover
fetch(
    `https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/latest_photos?api_key=${getCookie(
        "nasakey"
    )}`
)
    .then((response) => response.json())
    .then((data) => {
        if (data.latest_photos && data.latest_photos.length > 0) {
            const img =
                data.latest_photos[
                    Math.floor(
                        Math.random() * Math.min(45, data.latest_photos.length)
                    )
                ];
            const imgElement = document.getElementById("nPerseveranceImg");
            const date = document.getElementById("mEarthDate");
            const camera = document.getElementById("mCameraName");

            imgElement.setAttribute("src", img.img_src);
            date.innerHTML = img.earth_date;
            camera.innerHTML = img.camera.full_name;
        }
    })
    .catch((error) => console.error("Error fetching Mars rover data:", error));
