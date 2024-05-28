const { getDB } = require('./../Routes/dbconnection')


async function getUserByEmailId(email) {
    const db = getDB();
    const user = await db.collection("Users").findOne({ Username: email });
    return user;
}

async function updateUser(email, updatePayload) {
    console.log(";;;;;;;;;;;;;", email, updatePayload)
    const db = getDB();

    const res = await db.collection("Users")
        .updateOne(
            { Username: email },
            { $set: updatePayload }
        )
    return res;

}


async function verifyIfManager(email) {
    let isManager;
    const db = getDB();

    let managerLevelQueries = [
        { query: { "1st Manager Email ID": email} },
        { query: { "2nd Manager Email ID": email} },
        { query: { "3rd Manager Email ID": email} },
        { query: { "4th Manager Email ID": email} },
        { query: { "5th Manager Email ID": email} },
    ];

    for (let i = 4; i >= 0; i--) {
        let query = managerLevelQueries[i].query;
        isManager = await db.collection("employeeDetails").findOne(query);
        if (isManager) break;
    }

    return isManager;
}

module.exports = {
    getUserByEmailId,
    updateUser,
    verifyIfManager
}