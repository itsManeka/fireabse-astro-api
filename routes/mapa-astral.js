const express = require('express');
const router = express.Router();
const { db, admin, auth } = require('../firebase');
const astrolink = require('@itsmaneka/astrolink');

async function verifyUser(req) {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) throw new Error('Unauthorized');
    const decoded = await auth.verifyIdToken(token);
    return decoded.uid;
}

async function fireSet(collection, subcollection, values, uid) {
    const ref = db.collection(collection).doc(uid).collection(subcollection).doc('data');
    await ref.set(values);
}

async function fireAdd(collection, subcollection, values, uid) {
    const ref = db.collection(collection).doc(uid).collection(subcollection);
    await ref.add(values);
}

router.post("/calcular", async (req, res) => {
    try {
        const uid = await verifyUser(req);

        const { date, time, lat, lng, name } = req.body;

        if (!date || !time || lat == null || lng == null) {
            return res.status(400).json({ error: 'Data, hora ou local de nascimento ausentes.' });
        }

        res.status(202).json({ message: 'Iniciamos o calculo do seu mapa astral. Você será notificado quando concluído.' });

        const mapa = await astrolink.calcularMapaAstral({ date, time, lat, lng, name });

        fireSet('users', 'mapa_astral', {
            date,
            time,
            lat,
            lng,
            name,
            mapa,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        }, uid);

        fireAdd('users', 'notifications', {
            title: 'Mapa astral',
            message: 'O cálculo do seu mapa astral está pronto, acesse o menu Astrologia pra visualizar o resultado.',
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        }, uid);

    } catch (e) {
        console.error('Erro ao calcular mapa astral:', e);

        fireAdd('users', 'notifications', {
            title: 'Mapa astral',
            message: 'Ocorreu um erro ao calcular seu mapa astral, tente novamente mais tarde.',
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        }, uid);
    }
});

module.exports = router;