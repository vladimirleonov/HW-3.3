import app from "./app"
import {SETTINGS} from "./settings"
import {db} from "./db/mongoose-db"

const start = async () => {
    if (!await db.run(SETTINGS.MONGO_URL as string)) {
        console.log('stop')
        process.exit(1)
    }
    app.listen(SETTINGS.PORT || 3000, async () => {
        console.log(`...server started`)
    })
}

start()