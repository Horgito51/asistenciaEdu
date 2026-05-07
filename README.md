# AlegriApp

AlegriApp es un Prototipo Minimo Viable (PMV) para una aplicacion movil orientada a mejorar la comunicacion escolar entre docentes, autoridades y representantes. El objetivo principal es facilitar el envio de reportes, calificaciones, asistencia y notificaciones importantes, garantizando que la informacion pueda ser enviada, leida y confirmada mediante canales efectivos como Telegram.

Este repositorio contiene una version inicial desarrollada en HTML, CSS y JavaScript puro. Esta version funciona como maqueta interactiva del producto y permite validar las pantallas principales antes de escalar el proyecto a una aplicacion movil en Kotlin con Jetpack Compose.

## Problema

En instituciones educativas como Fe y Alegria, la comunicacion entre docentes, autoridades y representantes puede presentar retrasos, falta de confirmacion de lectura o dificultad para centralizar informacion importante. AlegriApp busca resolver este problema mediante una herramienta digital que permita registrar asistencia, gestionar notas, reportar incidentes y enviar notificaciones de manera mas organizada.

## Publico objetivo

El PMV esta dirigido a:

- Docentes de Fe y Alegria.
- Autoridades academicas e institucionales.
- Personal encargado de seguimiento estudiantil.
- Representantes que reciben informacion escolar relevante.

## Estado actual del proyecto

Actualmente el proyecto es un PMV web. No es todavia una aplicacion movil nativa, pero representa la experiencia base que posteriormente se implementara en Kotlin.

La version actual permite:

- Visualizar una pantalla de asistencia diaria.
- Marcar estudiantes como presentes, ausentes o atrasados.
- Consultar y editar notas por materia y actividad.
- Ver el perfil academico de cada estudiante.
- Crear reportes de incidentes.
- Simular el envio de reportes y boletines por Telegram.
- Mostrar una opcion premium para envio por WhatsApp.
- Registrar usuarios interesados en la beta mediante un formulario externo.

## Estructura del proyecto

```text
MVP/
|-- index.html
|-- README.md
|-- assets/
|   |-- style.css
|   |-- app.js
|-- .github/
|-- .vscode/
```

### index.html

Archivo principal de la aplicacion web. Contiene la estructura de las pantallas, modales, botones, tablas y formularios del PMV.

En este archivo se encuentran las tres vistas principales:

- Asistencia.
- Notas.
- Incidentes.

Tambien incluye los modales para perfil del estudiante, beta, premium y confirmaciones visuales.

### assets/style.css

Archivo de estilos del PMV. Define la apariencia visual de la interfaz, incluyendo:

- Barra de navegacion.
- Pestanas principales.
- Tarjetas de metricas.
- Tablas de estudiantes.
- Formularios.
- Botones.
- Modales.
- Diseno responsive para adaptar la interfaz a distintos tamanos de pantalla.

### assets/app.js

Archivo que contiene la logica del prototipo. Aqui se manejan:

- Datos simulados de estudiantes.
- Materias y actividades.
- Notas generadas para demostracion.
- Estado de asistencia.
- Historial de incidentes.
- Navegacion entre pantallas.
- Renderizado dinamico de tablas.
- Calculo de promedios.
- Simulacion de envio por Telegram.
- Apertura y cierre de modales.
- Conexion al formulario externo para registro beta.

## Funcionalidades core del PMV

### 1. Pantalla de Asistencia

Representa la futura `AttendanceScreen` de la aplicacion movil.

Permite al docente:

- Ver la lista de estudiantes.
- Marcar asistencia diaria.
- Registrar presente, ausente o tardanza.
- Ver contadores generales.
- Enviar la asistencia a inspeccion.

En la version Kotlin, esta pantalla se implementaria con Jetpack Compose y un `AttendanceViewModel` encargado de manejar el estado de la lista, los cambios de asistencia y el envio de datos.

### 2. Pantalla de Notas

Representa la futura `GradesScreen`.

Permite:

- Seleccionar materias.
- Seleccionar actividades.
- Editar notas por estudiante.
- Calcular promedios.
- Identificar estudiantes aprobados o en riesgo.
- Abrir el perfil academico individual.
- Simular el envio de boletines por Telegram.

En Kotlin, esta pantalla deberia separar la interfaz de la logica usando MVVM. Las notas se podrian guardar localmente con Room y sincronizar con una API cuando exista conexion.

### 3. Reporte de Incidentes

Representa la futura `IncidentScreen`.

Permite:

- Seleccionar estudiante.
- Definir severidad del incidente.
- Seleccionar tipo de incidente.
- Escribir una descripcion.
- Guardar el reporte.
- Simular el envio mediante Telegram.
- Consultar el historial de incidentes.

En la aplicacion movil, esta pantalla deberia conectarse con una API REST para guardar reportes y con un servicio de mensajeria para notificar a autoridades o representantes.

## Modelado de estado propuesto para Kotlin

Para escalar el PMV a Kotlin, se propone usar sealed classes para representar los estados de la interfaz y de las acciones de envio.

### Estado de carga de datos

Esta sealed class permite representar el estado de informacion como estudiantes, notas, asistencia o reportes.

```kotlin
sealed class UiState<out T> {
    object Loading : UiState<Nothing>()
    data class Success<T>(val data: T) : UiState<T>()
    data class Error(val message: String) : UiState<Nothing>()
}
```

Estados:

- `Loading`: los datos estan en proceso de carga.
- `Success`: los datos fueron obtenidos correctamente.
- `Error`: ocurrio un fallo al cargar la informacion.

### Estado de acciones de envio

Esta sealed class se usaria para acciones especificas, como enviar asistencia, boletines o reportes por Telegram.

```kotlin
sealed class SendState {
    object Idle : SendState()
    object Sending : SendState()
    object Success : SendState()
    data class Error(val message: String) : SendState()
}
```

Estados:

- `Idle`: estado inicial, sin accion en curso.
- `Sending`: la informacion se esta enviando.
- `Success`: el envio se completo correctamente.
- `Error`: ocurrio un problema durante el envio.

## Arquitectura esperada en Kotlin

La version movil se plantea con una arquitectura MVVM:

```text
app/
|-- data/
|   |-- local/
|   |   |-- database/
|   |   |-- dao/
|   |   |-- entities/
|   |-- remote/
|   |   |-- api/
|   |   |-- dto/
|   |-- repository/
|-- domain/
|   |-- model/
|   |-- usecase/
|-- presentation/
|   |-- attendance/
|   |-- grades/
|   |-- incidents/
|   |-- components/
|   |-- navigation/
```

### Capa data

Responsable del acceso a datos locales y remotos.

- Room para guardar informacion sin internet.
- Retrofit para comunicarse con una API REST.
- DTOs para representar respuestas del servidor.
- Repositorios para coordinar datos locales y remotos.

### Capa domain

Contiene las reglas principales del negocio.

- Modelos de estudiante, asistencia, nota e incidente.
- Casos de uso para registrar asistencia, guardar notas, enviar reportes y sincronizar datos.

### Capa presentation

Contiene las pantallas creadas con Jetpack Compose.

- `AttendanceScreen`.
- `GradesScreen`.
- `IncidentScreen`.
- ViewModels para manejar estado y eventos.
- Componentes reutilizables.
- Navegacion entre pantallas.

## Uso de mutableStateOf

Para un prototipo simple en Jetpack Compose, `mutableStateOf` puede usarse para manejar estado local. Sin embargo, para una aplicacion mas escalable, no se recomienda concentrar todo el estado en `MainActivity`.

La propuesta recomendada es:

- Usar `mutableStateOf` o `StateFlow` dentro de cada ViewModel.
- Mantener `MainActivity` como punto de entrada y configuracion de navegacion.
- Separar la logica de asistencia, notas e incidentes en ViewModels independientes.

Ejemplo:

```kotlin
class AttendanceViewModel : ViewModel() {
    var attendanceState by mutableStateOf<UiState<List<Student>>>(UiState.Loading)
        private set

    var sendState by mutableStateOf<SendState>(SendState.Idle)
        private set
}
```

## Estrategia de datos

La aplicacion movil se planifica para funcionar con y sin internet.

Cuando no exista conexion:

- Los datos se guardaran localmente con Room.
- Se almacenaran asistencias, notas e incidentes pendientes.
- El usuario podra seguir trabajando sin perder informacion.

Cuando exista conexion:

- Los datos pendientes se sincronizaran con una base de datos mediante una API REST.
- Se enviaran notificaciones por Telegram.
- Se actualizara el estado de confirmacion de los envios.

## Componente de inteligencia artificial

El componente de IA propuesto es la transcripcion de hojas de asistencia fisicas a registro digital.

Para la version movil se plantea usar ML Kit con reconocimiento de texto:

- Captura de imagen de una hoja de asistencia.
- Deteccion de texto mediante OCR.
- Extraccion de nombres, marcas o registros.
- Conversion de la informacion detectada a datos digitales.
- Revision manual antes de guardar o enviar.

Esta funcionalidad permitiria reducir el trabajo manual de digitalizar listas de asistencia.

## Integracion con Telegram

Telegram se considera el canal principal de comunicacion en la version inicial porque permite una integracion gratuita y flexible mediante bots.

Casos de uso esperados:

- Envio de asistencia a inspeccion.
- Envio de boletines a representantes.
- Envio de reportes de incidentes.
- Confirmacion del estado del envio.

## Cronograma de integracion tecnologica

| Semana | Funcionalidad | Tecnologia principal | Resultado esperado |
|---|---|---|---|
| 1 | Validacion del PMV web | HTML, CSS, JavaScript | Prototipo interactivo con las tres pantallas principales |
| 2 | Diseno de pantallas moviles | Kotlin, Jetpack Compose | Version inicial de AttendanceScreen, GradesScreen e IncidentScreen |
| 3 | Modelado de estado | Kotlin, sealed classes, ViewModel | Manejo de Loading, Success, Error, Idle y Sending |
| 4 | Arquitectura MVVM | ViewModel, Repository, Use Cases | Separacion entre UI, logica y datos |
| 5 | Persistencia local | Room | Guardado de asistencia, notas e incidentes sin internet |
| 6 | Sincronizacion remota | API REST, Retrofit | Envio de datos a una base de datos externa |
| 7 | Notificaciones | Telegram Bot API | Envio de reportes y boletines por Telegram |
| 8 | Inteligencia artificial | ML Kit OCR | Transcripcion de hojas de asistencia a registros digitales |
| 9 | Pruebas y mejoras | Testing, revision UX | Correccion de errores y mejora de flujo |
| 10 | Presentacion final | Demo funcional | Entrega del PMV y propuesta de escalabilidad movil |

## Stack tecnologico

### Version actual del PMV

- HTML.
- CSS.
- JavaScript puro.
- Google Forms para registro beta.
- Simulacion de envio mediante Telegram.

### Version movil propuesta

- Kotlin.
- Jetpack Compose.
- MVVM.
- ViewModel.
- `mutableStateOf` o `StateFlow`.
- Room.
- Retrofit.
- API REST.
- Telegram Bot API.
- ML Kit OCR.

## Como ejecutar el PMV

No se requiere instalar dependencias.

Opciones:

1. Abrir `index.html` directamente en el navegador.
2. Subir el proyecto a GitHub Pages.
3. Usar una extension como Live Server si se desea probarlo localmente con recarga automatica.

## Deploy sugerido en GitHub Pages

1. Crear un repositorio en GitHub.
2. Subir `index.html`, `README.md` y la carpeta `assets`.
3. Ir a `Settings > Pages`.
4. Seleccionar la rama principal como origen.
5. Esperar a que GitHub genere la URL publica.

## Conclusiones

AlegriApp inicia como un PMV web para validar la experiencia de usuario y las funcionalidades principales. La estructura actual permite demostrar el flujo de asistencia, notas e incidentes sin necesidad de una aplicacion movil completa.

La siguiente fase consiste en transformar este PMV en una aplicacion Android desarrollada en Kotlin, usando Jetpack Compose, arquitectura MVVM, persistencia local con Room, sincronizacion mediante API REST, notificaciones con Telegram y reconocimiento de texto con ML Kit.
