🦶 Podómetro Web (PWA)

Aplicación web progresiva que detecta pasos utilizando el acelerómetro del dispositivo y estima la distancia recorrida en función de la zancada del usuario.

Objetivo

Demostrar implementación frontend de:

- Uso de sensores web (DeviceMotionEvent)
- Filtrado básico de señal mediante umbral + cooldown
- Validación de velocidad para descartar vehículo
- Personalización de cálculo de zancada
- Implementación básica de PWA

Cómo funciona

- Se captura la aceleración en los ejes X, Y y Z.

Se calcula la magnitud total del vector:

- √(x² + y² + z²)
- Si supera un umbral definido y no está en periodo de cooldown, se registra un paso.
- Se aplica un cooldown fijo de 280ms para evitar duplicaciones.

La distancia se calcula como:

- pasos × longitud_zancada
- Se valida velocidad GPS < 3m/s para evitar conteo en vehículo.

Cálculo de zancada

- Promedio por sexo biológico.
- Ajuste opcional basado en altura.

Fórmula estimada:

- altura × factor

Limitaciones

- No funciona en segundo plano debido a restricciones del navegador.
- Depende de permisos de sensores y GPS.
- Puede generar falsos positivos en vibración sostenida.
- Cooldown fijo puede no adaptarse a carrera intensa.
- No implementa análisis de frecuencia avanzada ni ML.

Mejoras futuras

- Cooldown dinámico según ritmo.
- Detección basada en frecuencia en lugar de solo umbral.
- Persistencia diaria de datos.
- Exportación de historial.
- Conversión a app híbrida para ejecución en background.
- Eliminar la opción de seleccionar sexo biológico para evitar sesgos y solo implementar la formula usando solo la altura.


"Decidí no usar una librería de detección de pasos porque mi objetivo principal era comprender el problema desde la base.
Implementarlo manualmente me permitió entender las limitaciones del enfoque y detectar errores comunes.
Una librería abstrae esa complejidad."
