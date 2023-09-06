# fb-downloader v1.1.0

#### Downloads HD videos from Facebook

##### Developed By

[![N|Solid](https://blog.tcmhack.in/wp-content/uploads/2019/04/cropped-tcmhack-logo.png)](https://admin.tcmhack.in)

and

<strong style="font-size: 40px">[XaviaBot](https://github.com/XaviaTeam)</strong>

FB Downloader is a simple JavaScript package which provides a facility to download videos form Facebook in available quality

It is open source with a [public repository](https://github.com/RFS-ADRENO/fb-downloader.git) on GitHub.

(this is a modified fork)

```
<hr />

## Example

```javascript
import getFBInfo from "@megatroncupcakes/fb-downloader";

// OR

const getFBInfo = require("@megatroncupcakes/fb-downloader");

getFBInfo("https://www.facebook.com/watch?v=272591278381388")
    .then((result) => console.log("Result:", result))
    .catch((error) => console.log("Error:", error));

// OR

async function printFBInfo() {
    try {
        const result = await getFBInfo(
            "https://www.facebook.com/watch?v=272591278381388"
        );
        console.log("Result:", result);
    } catch (error) {
        console.log("Error:", error);
    }
}

printFBInfo();
```

### Cookies and User-Agent (Optional)

```javascript
const cookies = "your-facebook-cookies";
const userAgent = "your-user-agent";

getFBInfo(
    "https://www.facebook.com/watch?v=272591278381388",
    cookies,
    userAgent
)
    .then((result) => console.log("Result:", result))
    .catch((error) => console.log("Error:", error));
```

### OUTPUT

```json
{
    "url": "URL",
    "videoId": "FACEBOOK_VIDEO_ID",
    "videoStream": "VIDEO_STREAM_URL",
    "audioStream": "AUDIO_STREAM_URL",
    "thumbnail": "THUMBNAIL_URL"
}
```
