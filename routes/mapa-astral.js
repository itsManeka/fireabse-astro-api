const express = require('express');
const router = express.Router();
const { db, admin } = require('../firebase');
const astrolink = require('@itsmaneka/astrolink');

async function verifyUser(req) {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) throw new Error('Unauthorized');
    const decoded = await auth.verifyIdToken(token);
    return decoded.uid;
}

async function setDocument(document, values, uid) {
    const ref = doc(db, document, uid);
    await ref.setDoc(values);
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

        setDocument("mapa_astral", {
            date,
            time,
            lat,
            lng,
            name,
            mapa,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        }, uid);

        setDocument('notificacoes', {
            message: `O seu mapa astral foi calculado com sucesso.`,
            status: 'success',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        }, uid);

    } catch (e) {
        console.error('Erro ao calcular mapa astral:', e);

        setDocument('notificacoes', {
            message: 'Ocorreu um erro ao calcular seu mapa astral.',
            status: 'error',
            error: e.message,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        }, uid);
    }
});

module.exports = router;