const crypto = require('crypto');
const admin = require('firebase-admin');



exports.post = (app) => {
    app.post('/api/user', async (req, res) => {
        const data = req.body;

        if (!data.alias) {
            res.status(400).json({
                error: 'invalid alias'
            })
            return;
        }

        const querySnap = await admin.firestore().collection('users').where('alias', '==', data.alias).get();

        if (!querySnap.empty) {
            res.status(400).json({
                error: 'alias already exists'
            })
            return;
        }

        const apikey = crypto.randomBytes(32).toString('hex');

        await admin.firestore().collection('users').doc().set({
            alias: data.alias,
            apikey: apikey,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
    
        res.json({
            alias: data.alias,
            apikey: apikey
        });
    });
}