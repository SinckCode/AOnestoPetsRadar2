import { FoundPetCDto } from "src/core/interfaces/found-pet.interfaces";
import { generateMapboxImage } from "src/core/utils/utils";

export const generateFoundPetEmailTemplate = (pet: FoundPetCDto): string => {

    const imageUrl = generateMapboxImage(pet.lat, pet.lon);

    const date = new Date().toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="margin:0;padding:0;background:#000000;font-family:Segoe UI,Roboto,Arial,sans-serif;color:#ffffff;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#000000;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#0a0a0a;border-radius:22px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);box-shadow:0 20px 80px rgba(0,0,0,0.8);">

<!-- HEADER -->

<tr>
<td style="padding:26px 32px;border-bottom:1px solid rgba(255,255,255,0.08);">

<table width="100%">
<tr>

<td>

<span style="display:inline-block;width:10px;height:10px;background:#ffffff;border-radius:50%;margin-right:6px;"></span>
<span style="display:inline-block;width:10px;height:10px;background:#ffffff55;border-radius:50%;margin-right:6px;"></span>
<span style="display:inline-block;width:10px;height:10px;background:#ffffff22;border-radius:50%;"></span>

</td>

<td align="right" style="font-size:12px;color:#ffffffaa;letter-spacing:2px;font-weight:600;">
PETRADAR ALERT SYSTEM |
</td>

</tr>
</table>

</td>
</tr>

<!-- MATCH BADGE -->

<tr>
<td style="padding:30px 40px 0;">

<span style="display:inline-block;border:1px solid rgba(255,255,255,0.25);padding:8px 18px;border-radius:40px;font-size:12px;color:#ffffffcc;letter-spacing:1px;">
● POSSIBLE MATCH DETECTED
</span>

</td>
</tr>

<!-- ENGINE STATUS -->

<tr>
<td style="padding:18px 40px 0;font-size:12px;color:#ffffffaa;letter-spacing:2px;font-weight:600;">
MATCH ENGINE · ACTIVE ALERT
</td>
</tr>

<!-- MAIN TITLE -->

<tr>
<td style="padding:14px 40px 0;">

<h1 style="margin:0;font-size:40px;font-weight:800;line-height:1.2;color:#ffffff;">
podríamos haber<br>
encontrado a tu mascota
</h1>

</td>
</tr>

<!-- DESCRIPTION -->

<tr>
<td style="padding:20px 40px 0;">

<p style="margin:0;font-size:16px;line-height:1.6;color:rgba(255,255,255,0.75);">
Detectamos un reporte de mascota encontrada que podría coincidir con una búsqueda activa.
Revisa cuidadosamente la información y valida los detalles antes de confirmar.
</p>

</td>
</tr>

<!-- PET DATA -->

<tr>
<td style="padding:34px 40px 0;">

<table width="100%">
<tr>

<td width="33%" style="padding:12px;">
<div style="border:1px solid rgba(255,255,255,0.12);border-radius:14px;padding:16px;text-align:center;">
<div style="font-size:11px;color:rgba(255,255,255,0.55);letter-spacing:1px;margin-bottom:6px;">ESPECIE</div>
<div style="font-size:18px;font-weight:700;color:#ffffff;">${pet.species}</div>
</div>
</td>

<td width="33%" style="padding:12px;">
<div style="border:1px solid rgba(255,255,255,0.12);border-radius:14px;padding:16px;text-align:center;">
<div style="font-size:11px;color:rgba(255,255,255,0.55);letter-spacing:1px;margin-bottom:6px;">RAZA</div>
<div style="font-size:18px;font-weight:700;color:#ffffff;">${pet.breed ?? "No identificada"}</div>
</div>
</td>

<td width="33%" style="padding:12px;">
<div style="border:1px solid rgba(255,255,255,0.12);border-radius:14px;padding:16px;text-align:center;">
<div style="font-size:11px;color:rgba(255,255,255,0.55);letter-spacing:1px;margin-bottom:6px;">ESTADO</div>
<div style="font-size:18px;font-weight:700;color:#ffffff;">Posible match</div>
</div>
</td>

</tr>
</table>

</td>
</tr>

<!-- DESCRIPTION CARD -->

<tr>
<td style="padding:24px 40px 0;">

<div style="border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:22px;">

<div style="font-size:12px;color:rgba(255,255,255,0.55);letter-spacing:2px;margin-bottom:10px;">
DESCRIPCIÓN DEL REPORTE
</div>

<div style="font-size:15px;line-height:1.6;color:#ffffff;">
${pet.description}
</div>

</div>

</td>
</tr>

<!-- MAP -->

<tr>
<td style="padding:30px 40px 0;">

<img src="${imageUrl}"
style="width:100%;border-radius:16px;display:block;border:1px solid rgba(255,255,255,0.08);">

</td>
</tr>

<!-- CONTACT -->

<tr>
<td style="padding:30px 40px 0;">

<div style="border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:22px;">

<div style="font-size:12px;color:rgba(255,255,255,0.55);letter-spacing:2px;margin-bottom:12px;">
PERSONA QUE REPORTÓ
</div>

<div style="font-size:15px;color:#ffffff;margin-bottom:4px;">
${pet.finder_name}
</div>

<div style="font-size:14px;color:rgba(255,255,255,0.75);">
${pet.finder_email}
</div>

<div style="font-size:14px;color:rgba(255,255,255,0.75);margin-top:4px;">
${pet.finder_phone}
</div>

</div>

</td>
</tr>

<!-- FOOTER -->

<tr>
<td style="padding:40px 40px 32px;text-align:center;border-top:1px solid rgba(255,255,255,0.08);margin-top:30px;">

<div style="font-size:12px;color:rgba(255,255,255,0.55);">
Reporte generado el ${date}
</div>

<div style="font-size:12px;color:rgba(255,255,255,0.35);margin-top:6px;">
PetRadar System
</div>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};
