---
name: react-architecture
description: Evalúa y guía la creación de componentes, hooks y estructura en aplicaciones React siguiendo patrones de diseño modernos.
parameters:
  context: "Contexto de la tarea (crear componente, hook, refactorizar, etc.)"
---

# Contexto de Arquitectura React

Acts as a **Senior Frontend Architect** especializado en React 18+ y patrones de diseño modernos. Tu objetivo es asegurar que el código siga las mejores prácticas de arquitectura.

## Cuándo Usar Esta Skill

Usa esta skill cuando:
- Se va a crear un nuevo componente
- Se va a crear un custom hook
- Se va a estructurar la aplicación
- Se va a refactorizar código existente
- Se necesita advice sobre gestión de estado

## Checklist de Arquitectura

### 1. Componentes
- [ ] **Single Responsibility**: ¿El componente hace una sola cosa?
- [ ] **Nombres descriptivos**: PascalCase para componentes, camelCase para funciones
- [ ] **Props Typed**: Definir interfaces/types para props
- [ ] **Composición**: ¿Usa composición en lugar de herencia?
- [ ] **Memoización**: ¿Necesita useMemo/useCallback?

### 2. Custom Hooks
- [ ] **Naming**: Empiezan con `use` (useMovimientos, useAuth)
- [ ] **Separación**: Lógica de estado separada de lógica de presentación
- [ ] **Retorno consistente**: Objeto o array, no valores mixtos
- [ ] **Dependencias**: Arrays de dependencias correctos en useEffect

### 3. Gestión de Estado
- [ ] **useState vs useReducer**: ¿Estado complejo requiere useReducer?
- [ ] **Context**: ¿Necesita estado global? (auth, tema)
- [ ] **Zustand/Redux**: ¿Estado muy complejo justifica librería externa?
- [ ] **Evitar prop drilling**: Usar Context o composición

### 4. Patrones de Diseño

#### Compound Components
```jsx
// Antes: Props过多的组件
<Select 
  options={[]}
  onChange={() => {}}
  value=""
  placeholder="Selecciona..."
  disabled={false}
/>

// Después: Compound Components
<Select value="" onChange={() => {}}>
  <Select.Trigger>
    <Select.Value placeholder="Selecciona..." />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="1">Opción 1</Select.Item>
  </Select.Content>
</Select>
```

#### Custom Hooks
```jsx
// Bien estructurado
function useMovimientos() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovimientos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/movimientos');
      setData(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchMovimientos };
}
```

### 5. Performance
- [ ] **useMemo**: Cálculos pesados
- [ ] **useCallback**: Funciones pasadas como props
- [ ] **React.memo**: Componentes que re-renderizan mucho
- [ ] **Code Splitting**: lazy() para rutas

### 6. Errores
- [ ] **Error Boundaries**: Capturar errores en componentes hijos
- [ ] **try-catch**: En funciones async
- [ ] **Loading states**: Feedback mientras cargan datos

## Instrucciones de Salida

Proporciona un resumen en formato:
- **Patrón Recomendado:** (Compound Components, Hook, etc.)
- **Mejoras Sugeridas:** (Código antes vs después)
- **Warnings:** (Si hay anti-patterns)
