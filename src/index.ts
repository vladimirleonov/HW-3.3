import app from "./app"
import {SETTINGS} from "./settings"
import {connectToDB} from "./db/mongo-db";

const start = async () => {
    if(!await connectToDB(SETTINGS.MONGO_URL as string)) {
        console.log('stop')
        process.exit(1)
        //return
    }
    app.listen(SETTINGS.PORT || 3000, async () => {
        console.log(`...server started`)
        //console.log((await postCollection.find({title: 'xxx' /*new RegExp('x', 'i')*/ }, {projection: {title: 1, _id: 0}}).limit(3).toArray()) as {title: string}[])
        //console.log((await postCollection.countDocuments({ title: new RegExp('x', '1') }))) // count documents
    })
}

start()