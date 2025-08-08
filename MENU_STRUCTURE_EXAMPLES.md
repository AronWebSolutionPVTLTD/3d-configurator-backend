# Menu Structure Examples - Visual Guide

## 1. **Type Menu** (Simple Structure)
```
┌─────────────────────────────────────┐
│ Type (Selected)                     │
│ ┌─────────────────────────────────┐ │
│ │ Select your jersey type         │ │
│ │                                 │ │
│ │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │ │
│ │ │ Pro │ │Elite│ │Prac.│ │Hock.│ │ │
│ │ │ $99 │ │ $63 │ │ $53 │ │ $58 │ │ │
│ │ └─────┘ └─────┘ └─────┘ └─────┘ │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

hasSubItems: false
subItems: [] 
contentModel: "TypeConfiguration"
hasTabs: false
tabs: []
```

## 2. **Features Menu** (Sub-items Structure)
```
┌─────────────────────────────────────┐
│ Features                            │
│ ├─ Shoulder Style (Active)          │
│ │   ┌─────────────────────────────┐ │
│ │   │ Square │ Rounded            │ │
│ │   └─────────────────────────────┘ │
│ ├─ Collar Style                     │
│ ├─ Fight Strap                      │
│ └─ Interior Collar                  │
└─────────────────────────────────────┘

hasSubItems: true
subItems: [
  { id: "shoulder-style", name: "Shoulder Style", isActive: true },
  { id: "collar-style", name: "Collar Style", isActive: false },
  { id: "fight-strap", name: "Fight Strap", isActive: false }
]
contentModel: "FeaturesConfiguration"
hasTabs: false
tabs: []
```

## 3. **Color Menu** (Tab Structure)
```
┌─────────────────────────────────────┐
│ Color                               │
│ ┌─────────────────────────────────┐ │
│ │ [Colors] │ [Gradient]           │ │
│ │                                 │ │
│ │ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ │ │
│ │ │R│ │G│ │B│ │Y│ │O│ │P│ │W│ │K│ │ │
│ │ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

hasSubItems: false
subItems: []
contentModel: "ColorConfiguration"
hasTabs: true
tabs: [
  { id: "colors", name: "Colors", isActive: true },
  { id: "gradient", name: "Gradient", isActive: false }
]
```

## 4. **Design Menu** (Complex Structure - Sub-items + Tabs)
```
┌─────────────────────────────────────┐
│ Design                              │
│ ├─ Templates (Active)               │
│ │   ┌─────────────────────────────┐ │
│ │   │ [Presets] │ [Upload]        │ │
│ │   │                             │ │
│ │   │ ┌─────┐ ┌─────┐ ┌─────┐     │ │
│ │   │ │Temp1│ │Temp2│ │Temp3│     │ │
│ │   │ └─────┘ └─────┘ └─────┘     │ │
│ │   └─────────────────────────────┘ │
│ ├─ Custom Design                    │
│ └─ Upload Design                    │
└─────────────────────────────────────┘

hasSubItems: true
subItems: [
  { id: "templates", name: "Templates", isActive: true },
  { id: "custom", name: "Custom Design", isActive: false }
]
contentModel: "DesignConfiguration"
hasTabs: true
tabs: [
  { id: "presets", name: "Presets", isActive: true },
  { id: "upload", name: "Upload", isActive: false }
]
```

## 5. **Action Items** (No Content)
```
┌─────────────────────────────────────┐
│ Undo ← → Redo                       │
│ Support                             │
└─────────────────────────────────────┘

hasSubItems: false
subItems: []
contentModel: null
hasTabs: false
tabs: []
```

## Field Usage Summary

| Menu Type | hasSubItems | subItems | contentModel | hasTabs | tabs | Use Case |
|-----------|-------------|----------|--------------|---------|------|----------|
| **Type** | `false` | `[]` | `"TypeConfiguration"` | `false` | `[]` | Simple product selection |
| **Features** | `true` | `[{...}]` | `"FeaturesConfiguration"` | `false` | `[]` | Hierarchical options |
| **Color** | `false` | `[]` | `"ColorConfiguration"` | `true` | `[{...}]` | Tabbed content |
| **Design** | `true` | `[{...}]` | `"DesignConfiguration"` | `true` | `[{...}]` | Complex structure |
| **Undo/Redo** | `false` | `[]` | `null` | `false` | `[]` | Action items |

## Implementation Examples

### Frontend Rendering Logic
```javascript
const renderMenuItem = (item) => {
  // 1. Check if it has sub-items
  if (item.hasSubItems) {
    return renderExpandableMenu(item);
  }
  
  // 2. Check if it has tabs
  if (item.hasTabs) {
    return renderTabbedMenu(item);
  }
  
  // 3. Check if it has content
  if (item.contentModel) {
    return renderContentMenu(item);
  }
  
  // 4. Action item
  return renderActionItem(item);
};
```

### Content Loading Logic
```javascript
const loadMenuContent = async (menuItem) => {
  if (!menuItem.contentModel) {
    // Handle action items
    return handleAction(menuItem.id);
  }
  
  // Load content based on contentModel
  const content = await fetch(`${API_BASE}/get-${menuItem.contentModel.toLowerCase()}/${menuItem.id}`);
  
  if (menuItem.hasTabs) {
    // Render with tabs
    return renderTabbedContent(content, menuItem.tabs);
  } else {
    // Render simple content
    return renderSimpleContent(content);
  }
};
```

This structure gives you maximum flexibility to handle any UI pattern in your 3D configurator! 