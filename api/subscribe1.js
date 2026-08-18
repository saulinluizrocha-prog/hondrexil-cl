export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try {
      body = Object.fromEntries(new URLSearchParams(body));
    } catch (e) {
      body = {};
    }
  }

  const order = { ...body };
  order.is_smart_form = 'true';

  const rawIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket?.remoteAddress || '';
  const ip = String(rawIp).split(',')[0].trim();
  order.ip = ip;

  let refererQuery = {};
  if (req.headers['referer']) {
    try {
      const parsedUrl = new URL(req.headers['referer']);
      refererQuery = Object.fromEntries(parsedUrl.searchParams);
    } catch (e) {}
  }

  const payload = new URLSearchParams({
    ...refererQuery,
    ...order
  });

  let conversionId = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const response = await fetch('https://tracker.everad.com/conversion/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: payload.toString()
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.id) {
        conversionId = data.id.toString();
      }
    }
  } catch (err) {
    console.error('Tracker error:', err);
  }

  const name = String(order.name || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const phone = String(order.phone || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const sid5 = String(order.sid5 || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Hemos recibido su solicitud</title>
	<link rel="stylesheet" href="/default-css/subscribe-1.css">
	<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
	<script src="/default-js/call-center-reach-time.js"></script>
</head>
<body data-long-time-text="7 minutos">
	<div class="content">
		<div class="panel">
			<div class="panel-body">
				<div class="thank-you">¡Gracias! ¡Su pedido <span class="thank-you__order-id">№${conversionId}</span> se ha realizado con éxito!</div>
                    <div class="we-will-call-you we-will-call-you__timer" style="display: none;">
                        Nos comunicaremos con usted en <span class="we-will-call-you__countdown">00:07:00</span> minuto
                    </div>
                    <div class="we-will-call-you we-will-call-you__title">
                        Dentro de poco, un operador se pondrá en contacto con usted para aclarar los detalles.
                    </div>
				<form class="parent x_resubmit_form">
					<div class="data js-data">
						<div class="data__block">
							<div class="data__item">
								<span class="data__key">Su nombre:</span>
								<span class="x_client_name">${name}</span>
							</div>
							<div class="data__item">
								<span class="data__key">Su número de teléfono:</span>
								<span class="x_client_phone">${phone}</span>
							</div>
						</div>
						<span class="js-change-btn data__change">
						<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
									d="M1 14H4.25L5.0625 13.1875M1 14V10.75L1.8125 9.9375M1 14H14M9.53125 2.21875L10.75 1L14 4.25L12.7812 5.46875M9.53125 2.21875L12.7812 5.46875M9.53125 2.21875L1.8125 9.9375M12.7812 5.46875L5.0625 13.1875M1.8125 9.9375L5.0625 13.1875"
									stroke="#777777" />
						</svg>
						Editar
					</span>
					</div>
					<div class="correction js-change">
						<div class="correction__block">
							<p class="correction__title">Cambiar datos</p>
							<div class="correction__close js-btn-cancel">
								<span>Cancelar</span>
							</div>
						</div>
						<div class="correction__item">
							<label class="correction__label">Su nombre</label>
							<input class="correction__input correction__input--name" type="text" name="name" value="${name}">
						</div>
						<div class="correction__item">
							<label class="correction__label">Su número de teléfono</label>
							<input class="correction__input correction__input--phone" type="text" name="phone" value="${phone}" required>
							<input type="hidden" name="id" value="${conversionId}">
							<input type="hidden" name="sid5" value="${sid5}"/>
						</div>
						<div class="correction__buttons button">
						<button class="button__item js-btn-change">
							Editar
						</button>
						<span class="button__item js-btn-cancel button__item--cancel">
							No cambiar
						</span>
						</div>
					</div>
				</form>
				<div class="cta">
					<div class="cta__item">
						<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="20" cy="20" r="19" stroke="#FFD028" stroke-width="2" />
							<path d="M10.5 17.5L19 27.5L29 14" stroke="#FFD028" stroke-width="2" stroke-linecap="round"
								stroke-linejoin="round" />
						</svg>
						Verifique si el teléfono que ingresó está correcto
					</div>
					<div class="cta__item">
						<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="20" cy="20" r="19" stroke="#FFD028" stroke-width="2" />
							<path d="M10.5 17.5L19 27.5L29 14" stroke="#FFD028" stroke-width="2" stroke-linecap="round"
								stroke-linejoin="round" />
						</svg>
						Desactive el modo silencioso
					</div>
					<div class="cta__item">
						<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="20" cy="20" r="19" stroke="#FFD028" stroke-width="2" />
							<path d="M10.5 17.5L19 27.5L29 14" stroke="#FFD028" stroke-width="2" stroke-linecap="round"
								stroke-linejoin="round" />
						</svg>
						Mantenga su teléfono a mano
					</div>
					<div class="cta__item">
						<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="20" cy="20" r="19" stroke="#FFD028" stroke-width="2" />
							<path d="M10.5 17.5L19 27.5L29 14" stroke="#FFD028" stroke-width="2" stroke-linecap="round"
								stroke-linejoin="round" />
						</svg>
						Tome la llamada del número desconocido
					</div>
				</div>
			</div>
			<div class="subscribe__bar" style="display: none;">
				<span>¡Obtenga un descuento permanente!</span>
				<svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M1 6L7 12L13 6M1 1L7 7L13 1" stroke="black"></path>
				</svg>
			</div>
			<div class="subscribe">
				<div class="subscribe__cta">¡Obtenga un desconto permanente del 50% en su próxima compra!</div>
				<form class="subscribe__input" action="/api/mail-subscribe" method="post">
					<input
						type="email" name="email" placeholder="Introduzca su correo electrónico" autocomplete="email" required
					>
					<input type="hidden" name="id" value="${conversionId}">
					<button type="submit">
						<span class="subscribe__submit-text">Suscribirse</span>
						<svg width="24" height="19" viewBox="0 0 25 19" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M24 9.5L-5.96046e-07 9.5M24 9.5L15.5294 18M24 9.5L15.5294 1" stroke="black"></path>
						</svg>
					</button>
				</form>
			</div>
		</div>
		<div class="footer">
			<a href="/privacy.html" target="_blank">Política de privacidad</a>
		</div>
	</div>
	<script>
        $('.js-change-btn').click(function () {
            let nameBeforeChange = $('.x_client_name').html();
            let phoneBeforeChange = $('.x_client_phone').html();
            $('.js-data').hide();
            setTimeout(function () {
                $('.correction__input--name').val(nameBeforeChange);
                $('.correction__input--phone').val(phoneBeforeChange);
                $('.js-change').fadeIn(100);
            }, 0);
        });
        $('.js-btn-change').click(function () {
            let nameAfterChange = $('.correction__input--name').val();
            let phoneAfterChange = $('.correction__input--phone').val();
            $('.x_client_name').html(nameAfterChange);
            $('.x_client_phone').html(phoneAfterChange);
            $('.js-change').hide();
            setTimeout(function () {
                $('.js-data').fadeIn(100);
            }, 0);
        });
        $('.js-btn-cancel').click(function () {
            $('.js-change').hide();
            setTimeout(function () {
                $('.js-data').fadeIn(100);
            }, 0);
        });
	</script>
	<script>
        const session_id = uuid();
        const form = $('form.x_resubmit_form');
        const subscribeForm = $('form.subscribe__input');
        let timeSpent = 0;
        setInterval(function () { timeSpent++; }, 1000);
        $.post('/api/submit-version', getVersionData('created'), () => { console.log('order created');});
        localStorage.setItem('phone', getVersionData('created').phone);

        form.submit(function (ev) {
            ev.preventDefault();
            const data = {};
            form.find("input").each(function () {
                var input = $(this);
                data[input.attr("name")] = input.val();
            });
            data.id = parseInt(data.id);
            if(localStorage.getItem('phone') === getVersionData().phone) {
                $.post('/api/submit-version', getVersionData('skipped:duplicate'), () => { console.log('duplicate');});
                return;
            }
            if(getVersionData().phone.length < 3) {
                $.post('/api/submit-version', getVersionData('skipped:invalid'), () => { console.log('invalid');});
                return;
            }
            $.post('/api/resubmit', data, () => {
                console.log('phone resubmited');
                document.cookie = 'client_name=' + data.name +';';
                document.cookie = 'client_phone=' + data.phone +';';
                localStorage.setItem('phone', data.phone);
            });
            $.post('/api/submit-version', getVersionData('updated'), () => { console.log('phone resubmited');});
        });

        $(window).on('unload', function() {
            const query = $.param(getVersionData('user:left'));
            navigator.sendBeacon('/api/submit-version?' + query);
        });

        subscribeForm.submit(function (ev) {
            ev.preventDefault();
            const data = {};
            subscribeForm.find("input").each(function () {
                var input = $(this);
                data[input.attr("name")] = input.val();
            });
            $.post(
                '/api/submit-version',
                getVersionData('user:subscribed', data),
                () => { console.log('subscribed'); }
            );
            $.post(
                '/api/mail-subscribe',
                data,
                () => { window.location.pathname = '/success.html'; }
            );
        });

        function getVersionData(status = '', additionalParams = {}) {
            const data = { timeSpent: timeSpent + ' seconds' };
            form.find("input").each(function () {
                var input = $(this);
                data[input.attr("name")] = input.val();
            });
            if (!data.phone) {
               data.phone =  $('.x_client_phone').text();
            }
            if (!data.name) {
                data.name = $('.x_client_name').text();
            }
            data.id = parseInt(data.id);

            return {
                status: status,
                session_id: session_id,
                landing_url: document.location.href,
                data: JSON.stringify(Object.assign({}, additionalParams, data)),
                phone: data.phone,
                order_id: data.id
            };
        }

        function uuid() {
            var d = new Date().getTime();
            var d2 = (performance && performance.now && performance.now() * 1000) || 0;
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
                /[xy]/g,
                function (c) {
                    var r = Math.random() * 16;
                    if (d > 0) {
                        r = (d + r) % 16 | 0;
                        d = Math.floor(d / 16);
                    } else {
                        r = (d2 + r) % 16 | 0;
                        d2 = Math.floor(d2 / 16);
                    }
                    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
                }
            );
        }
	</script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(html);
}
