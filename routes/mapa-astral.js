const express = require('express');
const router = express.Router();
const { db, admin } = require('../firebase');
const astrolink = require('@itsmaneka/astrolink');

router.post("/calcular", async (req, res) => {
    try {
        const { date, time, lat, lng, name } = req.body;

        if (!date || !time || lat == null || lng == null) {
            return res.status(400).json({ error: 'Data, hora ou local de nascimento ausentes.' });
        }

        res.status(202).json({ message: 'Iniciamos o calculo do seu mapa astral. Você será notificado quando concluído.' });

        const mapa = await astrolink.calcularMapaAstral({ date, time, lat, lng, name });

        const mapaAstralRef = db.collection('mapa_astral').doc();
        await mapaAstralRef.set({
            date,
            time,
            lat,
            lng,
            name,
            mapa,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        const notificacoesRef = db.collection('notificacoes').doc();
        await notificacoesRef.set({
            message: `O seu mapa astral foi calculado com sucesso.`,
            status: 'success',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

    } catch (e) {
        console.error('Erro ao calcular mapa astral:', e);

        const notificacoesRef = db.collection('notificacoes').doc();
        await notificacoesRef.set({
            message: 'Ocorreu um erro ao calcular seu mapa astral.',
            status: 'error',
            error: e.message,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
    }
});

module.exports = router;