const video = document.getElementById('video')
const canvas = document.getElementById('canvas')
const photoForm = document.getElementById('photo-form')
const photoInput = document.getElementById('photo')

// Запуск веб-камеры
navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
	video.srcObject = stream
})

// Событие при нажатии на кнопку "Сделать снимок"
document.getElementById('snap').addEventListener('click', () => {
	const context = canvas.getContext('2d')
	context.drawImage(video, 0, 0, canvas.width, canvas.height)
	const data = canvas.toDataURL('image/png')
	photoInput.value = data
})

// Перехват отправки формы
photoForm.addEventListener('submit', e => {
	e.preventDefault()
	const data = new FormData()
	data.append('photo', dataURItoBlob(photoInput.value), 'photo.png')

	fetch('/upload', {
		method: 'POST',
		body: data,
	})
		.then(response => response.text())
		.then(result => alert(result))
		.catch(error => console.error('Ошибка:', error))
})

// Функция преобразования Data URI в Blob
function dataURItoBlob(dataURI) {
	const byteString = atob(dataURI.split(',')[1])
	const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
	const ab = new ArrayBuffer(byteString.length)
	const ia = new Uint8Array(ab)

	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i)
	}

	return new Blob([ab], { type: mimeString })
}
