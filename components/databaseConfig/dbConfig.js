const mongoose = require("mongoose");

exports.dbConfig = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connected ${conn.connection.host}`);

    } catch (error) {
        console.error(`Database not connected: ${error.message}`);
        process.exit(1);
    }
}