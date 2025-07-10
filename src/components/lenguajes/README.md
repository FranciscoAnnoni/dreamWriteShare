# Sistema de Idiomas / Language System

Este sistema de internacionalización (i18n) permite manejar textos en inglés y español de forma centralizada y eficiente.

## 📁 Estructura de Archivos

```
src/components/lenguajes/
├── index.ts                    # Exportaciones principales
├── types.ts                    # Tipos de TypeScript
├── en.ts                       # Traducciones en inglés
├── es.ts                       # Traducciones en español
├── LanguageContext.tsx         # Contexto React y hooks
├── LanguageSwitcher.tsx        # Componente para cambiar idioma
└── README.md                   # Esta documentación
```

## 🚀 Configuración Inicial

### 1. Envolver la aplicación con el LanguageProvider

```tsx
// App.tsx
import { LanguageProvider } from './components/lenguajes';

function App() {
  return (
    <LanguageProvider>
      {/* Tu aplicación aquí */}
    </LanguageProvider>
  );
}
```

### 2. Usar traducciones en componentes

```tsx
import { useT } from './components/lenguajes';

const MyComponent = () => {
  const t = useT();
  
  return (
    <div>
      <h1>{t.shareIdea.title}</h1>
      <p>{t.shareIdea.subtitle}</p>
      <button>{t.shareIdea.sendButton}</button>
    </div>
  );
};
```

## 🛠️ Hooks Disponibles

### useT()
Hook principal para obtener todas las traducciones:
```tsx
const t = useT();
console.log(t.shareIdea.title); // "Share your idea" o "Comparte tu idea"
```

### useLanguage()
Hook completo con control del idioma:
```tsx
const { language, setLanguage, t } = useLanguage();

// Cambiar idioma
setLanguage('es'); // o 'en'

// Obtener idioma actual
console.log(language); // 'en' | 'es'
```

### useTranslations()
Alias de useT() para mayor claridad:
```tsx
const translations = useTranslations();
```

## 🌐 Componente LanguageSwitcher

Botón para cambiar entre idiomas:

```tsx
import LanguageSwitcher from './components/lenguajes/LanguageSwitcher';

// Uso básico
<LanguageSwitcher />

// Con props personalizadas
<LanguageSwitcher size="small" className="my-language-switcher" />
```

Props disponibles:
- `size`: 'small' | 'medium' | 'large'
- `className`: string

## 📝 Agregar Nuevas Traducciones

### 1. Actualizar types.ts
```typescript
export interface Translations {
  // ...traducciones existentes
  myNewSection: {
    title: string;
    subtitle: string;
    button: string;
  };
}
```

### 2. Actualizar en.ts
```typescript
export const englishTranslations: Translations = {
  // ...traducciones existentes
  myNewSection: {
    title: 'My New Title',
    subtitle: 'My new subtitle',
    button: 'Click me',
  },
};
```

### 3. Actualizar es.ts
```typescript
export const spanishTranslations: Translations = {
  // ...traducciones existentes
  myNewSection: {
    title: 'Mi Nuevo Título',
    subtitle: 'Mi nuevo subtítulo',
    button: 'Haz clic',
  },
};
```

## 💾 Persistencia

El idioma seleccionado se guarda automáticamente en `localStorage` con la clave `dreamWriteShare_language`.

## 🔧 Detección Automática

Si no hay idioma guardado, el sistema detecta automáticamente el idioma del navegador:
- Si es español ('es'), usa español
- Para cualquier otro idioma, usa inglés por defecto

## 🎯 Ejemplos de Uso

### Ejemplo básico
```tsx
import { useT } from './components/lenguajes';

const ShareIdea = () => {
  const t = useT();
  
  return (
    <form>
      <h1>{t.shareIdea.title}</h1>
      <input placeholder={t.shareIdea.placeholder} />
      <button>{t.shareIdea.sendButton}</button>
    </form>
  );
};
```

### Ejemplo con control de idioma
```tsx
import { useLanguage } from './components/lenguajes';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <header>
      <h1>{t.navigation.shareYourIdea}</h1>
      <button onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}>
        {language === 'en' ? '🇪🇸 Español' : '🇺🇸 English'}
      </button>
    </header>
  );
};
```

### Ejemplo con plurales
```tsx
const VoteCount = ({ count }: { count: number }) => {
  const t = useT();
  
  return (
    <span>
      {count} {count === 1 ? t.ideaDialog.vote : t.ideaDialog.votes}
    </span>
  );
};
```

## ✨ Características

- ✅ Tipado completo con TypeScript
- ✅ Detección automática de idioma
- ✅ Persistencia en localStorage
- ✅ Cambio de idioma en tiempo real
- ✅ Hooks simples y eficientes
- ✅ Componente de cambio de idioma incluido
- ✅ Soporte para emojis y caracteres especiales
