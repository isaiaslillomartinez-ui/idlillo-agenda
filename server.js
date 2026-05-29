const express = require('express');
const cors = require('cors');
 
const app = express();
app.use(express.json());
app.use(cors());
 
app.get('/', (req, res) => {
  res.send('Servidor ID Lillo SpA activo ✅');
});
 
app.post('/enviar-cita', async (req, res) => {
  const { nombre, telefono, empresa, direccion, fecha, hora, motivo } = req.body;
 
  if (!nombre || !telefono || !empresa || !direccion || !fecha || !hora || !motivo) {
    return res.status(400).json({ ok: false, error: 'Faltan campos obligatorios.' });
  }
 
  const htmlCorreo = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #dde3ed;border-radius:12px;overflow:hidden;">
      <div style="background:#1C2D4A;padding:22px 28px;">
        <h1 style="color:#ffffff;font-size:20px;margin:0;">ID Lillo SpA</h1>
        <p style="color:#C5980A;font-size:11px;margin:4px 0 0;text-transform:uppercase;letter-spacing:1px;">Ingeniería Eléctrica — Nueva Solicitud de Cita</p>
      </div>
 
      <div style="padding:24px 28px;">
        <p style="color:#6b7a99;font-size:13px;margin-bottom:22px;">Se ha recibido una nueva solicitud de agendamiento a través del formulario web.</p>
 
        <p style="font-size:12px;font-weight:700;color:#C5980A;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;border-bottom:1px solid #f0f0f0;padding-bottom:6px;">📋 Datos del Cliente</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
          <tr style="border-bottom:1px solid #f0f0f0;">
            <td style="padding:9px 0;color:#6b7a99;width:130px;">👤 Nombre</td>
            <td style="padding:9px 0;font-weight:600;color:#1a1a2e;">${nombre}</td>
          </tr>
          <tr style="border-bottom:1px solid #f0f0f0;">
            <td style="padding:9px 0;color:#6b7a99;">📞 Teléfono</td>
            <td style="padding:9px 0;font-weight:600;color:#1a1a2e;">${telefono}</td>
          </tr>
          <tr style="border-bottom:1px solid #f0f0f0;">
            <td style="padding:9px 0;color:#6b7a99;">🏢 Empresa</td>
            <td style="padding:9px 0;font-weight:600;color:#1a1a2e;">${empresa}</td>
          </tr>
          <tr>
            <td style="padding:9px 0;color:#6b7a99;">📍 Dirección</td>
            <td style="padding:9px 0;font-weight:600;color:#1a1a2e;">${direccion}</td>
          </tr>
        </table>
 
        <p style="font-size:12px;font-weight:700;color:#C5980A;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;border-bottom:1px solid #f0f0f0;padding-bottom:6px;">📅 Datos de la Cita</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr style="border-bottom:1px solid #f0f0f0;">
            <td style="padding:9px 0;color:#6b7a99;width:130px;">📅 Fecha</td>
            <td style="padding:9px 0;font-weight:600;color:#1a1a2e;">${fecha}</td>
          </tr>
          <tr style="border-bottom:1px solid #f0f0f0;">
            <td style="padding:9px 0;color:#6b7a99;">⏰ Hora</td>
            <td style="padding:9px 0;font-weight:600;color:#1a1a2e;">${hora}</td>
          </tr>
          <tr>
            <td style="padding:9px 0;color:#6b7a99;vertical-align:top;">📝 Motivo</td>
            <td style="padding:9px 0;font-weight:600;color:#1a1a2e;">${motivo}</td>
          </tr>
        </table>
      </div>
 
      <div style="background:#f4f6f9;padding:14px 28px;text-align:center;font-size:11px;color:#6b7a99;">
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
        from: 'ID Lillo SpA <contacto@idlillo.cl>',
        to: ['contacto@idlillo.cl'],
        subject: `Nueva cita: ${nombre} — ${empresa} — ${fecha} ${hora}`,
        html: htmlCorreo
      })
    });
 
    const data = await response.json();
    if (response.ok) {
      res.json({ ok: true, mensaje: 'Correo enviado correctamente.' });
    } else {
      console.error('Error Resend:', JSON.stringify(data));
      res.status(500).json({ ok: false, error: data.message || 'Error al enviar.' });
    }
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
