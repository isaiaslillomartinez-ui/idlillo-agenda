const express = require('express');
const cors = require('cors');
 
const app = express();
app.use(express.json());
app.use(cors());
 
app.get('/', (req, res) => {
  res.send('Servidor ID Lillo SpA activo ✅');
});
 
app.post('/enviar-cita', async (req, res) => {
  const { nombre, fecha, hora, motivo } = req.body;
 
  if (!nombre || !fecha || !hora || !motivo) {
    return res.status(400).json({ ok: false, error: 'Faltan campos obligatorios.' });
  }
 
  const htmlCorreo = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;border:1px solid #dde3ed;border-radius:12px;overflow:hidden;">
      <div style="background:#1C2D4A;padding:20px 24px;">
        <h1 style="color:#ffffff;font-size:18px;margin:0;">ID Lillo SpA</h1>
        <p style="color:#C5980A;font-size:11px;margin:4px 0 0;text-transform:uppercase;letter-spacing:1px;">Ingeniería Eléctrica — Nueva Solicitud de Cita</p>
      </div>
      <div style="padding:24px;">
        <p style="color:#6b7a99;font-size:13px;margin-bottom:20px;">Se ha recibido una nueva solicitud de agendamiento a través del formulario web.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px 0;color:#6b7a99;width:120px;">👤 Nombre</td>
            <td style="padding:10px 0;font-weight:600;color:#1a1a2e;">${nombre}</td>
          </tr>
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px 0;color:#6b7a99;">📅 Fecha</td>
            <td style="padding:10px 0;font-weight:600;color:#1a1a2e;">${fecha}</td>
          </tr>
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px 0;color:#6b7a99;">⏰ Hora</td>
            <td style="padding:10px 0;font-weight:600;color:#1a1a2e;">${hora}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#6b7a99;vertical-align:top;">📝 Motivo</td>
            <td style="padding:10px 0;font-weight:600;color:#1a1a2e;">${motivo}</td>
          </tr>
        </table>
      </div>
      <div style="background:#f4f6f9;padding:14px 24px;text-align:center;font-size:11px;color:#6b7a99;">
        Formulario de agendamiento — ID Lillo SpA · contacto@idlillo.cl · +56 9 4232 2193
      </div>
    </div>
  `;
 
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'ID Lillo SpA <onboarding@resend.dev>',
        to: ['contacto@idlillo.cl'],
        subject: `Nueva cita: ${nombre} — ${fecha} ${hora}`,
        html: htmlCorreo
      })
    });
 
    const data = await response.json();
 
    if (response.ok) {
      res.json({ ok: true, mensaje: 'Correo enviado correctamente.' });
    } else {
      console.error('Error Resend:', data);
      res.status(500).json({ ok: false, error: data.message || 'Error al enviar.' });
    }
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
