import app from "./app"
import {SETTINGS} from "./settings"
import {connectToDB} from "./db/mongo-db"

const start = async () => {
    if (!await connectToDB(SETTINGS.MONGO_URL as string)) {
        console.log('stop')
        process.exit(1)
    }
    app.listen(SETTINGS.PORT || 3000, async () => {
        console.log(`...server started`)
    })
}

start()