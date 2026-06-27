// ===== INICIO CAMBIO TP FINAL - TEST MIME VALIDATION =====

testUtils.createTestButton("Test MIME inválido (.wav falso)", async (btn) => {

    await okLogin();
    const token = localStorage.getItem('test_token');

    // 🔴 Archivo falso: texto con extensión wav
    const fakeAudio = new Blob(
        ["ESTO NO ES UN AUDIO REAL"],
        { type: "text/plain" }
    );

    const formData = new FormData();
    formData.append('display_name', 'Fake WAV Test');
    formData.append('category', 'Test');
    formData.append('bpm', '120');

    // forzamos extensión .wav
    formData.append('audioFile', fakeAudio, 'fake.wav');

    const response = await fetch('/api/samples/upload', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    const data = await response.json();
    testUtils.log(data);

    // ✅ ÉXITO si el backend lo rechaza
    if (response.status === 415) {
        testUtils.setSuccess(btn);
    }
});

// ===== FIN CAMBIO TP FINAL - TEST MIME VALIDATION =====