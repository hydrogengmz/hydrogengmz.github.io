function getCookie(cookieName) {
    return localStorage.getItem(cookieName);
}

function keyCheck() {
    if (!getCookie("nasakey")) {
        console.log("No API key found. Prompting user for input."); // Debug log
        const apikey = prompt(
            "Please enter your NASA API key to be saved locally:"
        );
    
        if (apikey) {
            localStorage.setItem("nasakey", apikey);
            console.log("API key saved to localStorage."); // Debug log
        } else {
            console.log("No API key provided. Skipping data fetching."); // Debug log
            // Skip the rest of the script since no API key was provided
            throw new Error("API key is required.");
        }
    } else {
        console.log("API key already exists in localStorage."); // Debug log
    }
}

keyCheck();

// Fetch NASA APOD data
fetch(`https://api.nasa.gov/planetary/apod?api_key=${getCookie("nasakey")}`)
    .then((response) => response.json())
    .then((data) => {
        const title = document.getElementById("nTitle");
        const img = document.getElementById("nasaImg");
        const bginfo = document.getElementById("bgInfoNasa");

        title.innerHTML = data.title;
        img.setAttribute("src", data.url);
        bginfo.innerHTML = data.explanation;
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
