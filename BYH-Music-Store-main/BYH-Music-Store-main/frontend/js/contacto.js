/**
 * Archivo: contacto.js
 * 
 * Descripción:
 * Este módulo maneja toda la lógica del formulario de contacto del sitio web.
 * Incluye validación de campos, manejo dinámico de campos según el tipo de contacto
 * y simulación de envío de formulario.
 * 
 * Características principales:
 * - Validación en tiempo real de campos de formulario
 * - Muestra/oculta campos según el tipo de contacto (particular/empresa)
 * - Validación de formato RUC peruano
 * - Validación de número de teléfono peruano
 * - Manejo de envío de formulario con retroalimentación al usuario
 * 
 * Notas de implementación:
 * - Utiliza expresiones regulares para validaciones
 * - Implementa manejo de eventos para interacción en tiempo real
 * - Sigue principios de accesibilidad web (a11y)
 */

// Inicialización cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // 1. Referencias a elementos del DOM
    // ============================================
    const formulario = document.getElementById('formularioContacto');
    const tipoContacto = document.getElementById('tipoContacto');
    const empresaFields = document.getElementById('empresaFields');
    const empresaInput = document.getElementById('empresa');
    
    
    // ============================================
    // 2. Manejo de campos condicionales
    // ============================================
    
    /**
     * Maneja la visualización de campos según el tipo de contacto seleccionado
     * - Si es 'empresa', muestra los campos adicionales
     * - Si es 'particular', oculta los campos adicionales
     */
    tipoContacto.addEventListener('change', function() {
        if (this.value === 'empresa') {
            empresaFields.style.display = 'block';
            empresaInput.setAttribute('required', 'required');
        } else {
            empresaFields.style.display = 'none';
            empresaInput.removeAttribute('required');
            empresaInput.value = '';
            document.getElementById('ruc').value = '';
        }
    });

    // ============================================
    // 3. Validación del formulario
    // ============================================
    
    /**
     * Maneja el envío del formulario
     * - Previene el envío por defecto
     * - Valida los campos según las reglas de negocio
     * - Muestra mensajes de error si es necesario
     * - Envía el formulario si la validación es exitosa
     */
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Valida RUC si es empresa
        if (tipoContacto.value === 'empresa') {
            const ruc = document.getElementById('ruc').value;
            if (ruc && !validarRUC(ruc)) {
                alert('Por favor ingrese un RUC válido (11 dígitos numéricos)');
                return false;
            }
        }
        
        // Valida teléfono si se ingresó
        const telefono = document.getElementById('telefono').value;
        if (telefono && !validarTelefono(telefono)) {
            alert('Por favor ingrese un número de teléfono válido (9 o 10 dígitos)');
            return false;
        }
        
        // Si todo está correcto, envía el formulario
        enviarFormulario();
    });
    
    // ============================================
    // 4. Funciones de validación
    // ============================================
    
    /**
     * Valida un RUC peruano
     * @param {string} ruc - Número de RUC a validar
     * @returns {boolean} true si el RUC es válido, false en caso contrario
     * 
     * Nota: Actualmente solo valida la longitud (11 dígitos).
     * Se podría implementar validación de dígito verificador si es necesario.
     */
    function validarRUC(ruc) {
        return /^\d{11}$/.test(ruc);
    }
    
    /**
     * Valida un número de teléfono peruano
     * @param {string} telefono - Número de teléfono a validar
     * @returns {boolean} true si el teléfono es válido, false en caso contrario
     * 
     * Un teléfono peruano válido puede tener:
     * - 9 dígitos para números móviles
     * - 10 dígitos para números fijos
     */
    function validarTelefono(telefono) {
        return /^\d{9,10}$/.test(telefono);
    }
    
    // ============================================
    // 5. Envío del formulario
    // ============================================
    
    /**
     * Procesa y envía el formulario de contacto
     * 
     * Esta función:
     * 1. Recopila los datos del formulario
     * 2. Simula el envío de datos a un servidor
     * 3. Muestra retroalimentación al usuario
     * 4. Reinicia el formulario después del envío exitoso
     * 
     * Nota: En una implementación real, aquí se haría una petición fetch
     * al backend para procesar el formulario.
     */
    function enviarFormulario() {
        // Recopila los datos del formulario
        const formData = new FormData(formulario);
        const datos = Object.fromEntries(formData);
        
        // En producción, aquí iría el código para enviar los datos al servidor
        console.log('Datos del formulario listos para enviar:', datos);
        
        // Simulación de envío exitoso
        try {
            // Mostrar mensaje de éxito
            alert('¡Gracias por contactarnos! Hemos recibido tu mensaje y nos pondremos en contacto contigo pronto.');
            
            // Reiniciar el formulario
            formulario.reset();
            
            // Ocultar campos de empresa si estaban visibles
            if (empresaFields) {
                empresaFields.style.display = 'none';
            }
            
            // Desplazar al usuario al inicio del formulario
            formulario.scrollIntoView({ behavior: 'smooth' });
            
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert('Ocurrió un error al enviar el formulario. Por favor, inténtalo de nuevo más tarde.');
        }
    }
    
    // ============================================
    // 6. Validación en tiempo real
    // ============================================
    
    // Campo RUC - Solo permite números y limita a 11 dígitos
    const rucInput = document.getElementById('ruc');
    if (rucInput) {
        rucInput.addEventListener('input', function() {
            // Elimina cualquier carácter que no sea número y limita a 11 dígitos
            this.value = this.value.replace(/\D/g, '').slice(0, 11);
            
            // Actualiza la validación visual
            if (this.value.length === 11) {
                this.setCustomValidity('');
            } else {
                this.setCustomValidity('El RUC debe tener 11 dígitos');
            }
        });
        
        // Validación al perder el foco
        rucInput.addEventListener('blur', function() {
            if (this.value && !validarRUC(this.value)) {
                this.setCustomValidity('Por favor ingrese un RUC válido');
            } else {
                this.setCustomValidity('');
            }
        });
    }
    
    // Campo Teléfono - Solo permite números y limita a 10 dígitos
    const telefonoInput = document.getElementById('telefono');
    if (telefonoInput) {
        telefonoInput.addEventListener('input', function() {
            // Elimina cualquier carácter que no sea número y limita a 10 dígitos
            this.value = this.value.replace(/\D/g, '').slice(0, 10);
            
            // Actualiza la validación visual
            if (this.value.length >= 9 && this.value.length <= 10) {
                this.setCustomValidity('');
            } else {
                this.setCustomValidity('El teléfono debe tener 9 o 10 dígitos');
            }
        });
        
        // Validación al perder el foco
        telefonoInput.addEventListener('blur', function() {
            if (this.value && !validarTelefono(this.value)) {
                this.setCustomValidity('Por favor ingrese un número de teléfono válido');
            } else {
                this.setCustomValidity('');
            }
        });
    }
});
