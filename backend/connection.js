import mongoose from 'mongoose'



const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        return 'done'
    } catch(err) {
        console.log(err)
        throw new Error('Failed to connect to database...')
    }
}

export default connect