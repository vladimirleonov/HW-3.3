import app from "./app"
import {SETTINGS} from "./settings"
import {connectToDB} from "./db/mongo-db";

const start = async () => {
    if(!await connectToDB(SETTINGS.MONGO_URL)) {
        console.log('stop')
        process.exit(1)
        return
    }
    app.listen(SETTINGS.PORT || 3000, () => {
        console.log(`...server started`)
    })
}

start()