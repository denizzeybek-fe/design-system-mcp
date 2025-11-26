# InTooltipV2

**Version:** v2

## Props

### `id`

**Type:** `String` | **Required**

### `text`

**Type:** `String` | **Required**

### `dynamicPosition`

**Type:** `Boolean` | **Default:** `true`

### `staticPosition`

**Type:** `String` | **Default:** `"top center"`

### `iconStatus`

**Type:** `Boolean` | **Default:** `false`

### `offset`

**Type:** `Object` | **Default:** `"[Function]"`

### `preventXss`

**Type:** `Boolean` | **Default:** `false`

### `maxHeight`

**Type:** `Number` | **Default:** `320`

### `status`

**Type:** `Boolean` | **Default:** `true`

### `tooltipAlignment`

**Type:** `any` | **Default:** `false`

### `absolutePositionStatus`

**Type:** `Boolean` | **Default:** `false`

### `absolutePosition`

**Type:** `Object` | **Default:** `"[Function]"`

### `absoluteTriangleAlignment`

**Type:** `String` | **Default:** `"center"`

### `absoluteTrianglePosition`

**Type:** `String` | **Default:** `"top"`

## Examples

### Basic Tooltip with Dynamic Positioning

Common use case: tooltip that adjusts position automatically

```vue
<template>
  <div>
    <button id="help-btn">
      Help
      <InTooltipV2
        id="help-tooltip"
        :dynamic-position="true"
        tooltip-text="Click for help documentation"
        :offset="{ x: 0, y: 8 }"
      />
    </button>
  </div>
</template>
```

### Fixed Position Tooltip

Tooltip with absolute positioning for fixed UI elements

```vue
<template>
  <InTooltipV2
    id="fixed-tooltip"
    :dynamic-position="false"
    :absolute-position="{ top: 60, right: 20 }"
    tooltip-text="System notification"
    :icon-status="true"
  />
</template>
```

### Tooltip with Custom Offset

Larger offset for better spacing in dense layouts

```vue
<template>
  <div class="icon-grid">
    <div class="icon-item">
      <InIcons name="settings" />
      <InTooltipV2
        id="settings-tooltip"
        :dynamic-position="true"
        static-position="bottom center"
        :offset="{ x: 0, y: 16 }"
        tooltip-text="Application Settings"
      />
    </div>
  </div>
</template>
```

## Common Mistakes

ℹ️ **Using absolutePosition with dynamicPosition enabled**

When dynamicPosition is true, absolutePosition prop is completely ignored

**Wrong:**
```vue
<InTooltipV2 :dynamic-position="true" :absolute-position="{ top: 0, left: 0 }" />
```

**Correct:**
```vue
<InTooltipV2 :dynamic-position="false" :absolute-position="{ top: 0, left: 0 }" />
```

ℹ️ **Using string values for offset coordinates**

offset.x and offset.y must be numbers, not strings with units

**Wrong:**
```vue
:offset="{ x: '4px', y: '4px' }"
```

**Correct:**
```vue
:offset="{ x: 4, y: 4 }"
```

ℹ️ **Not considering viewport boundaries**

When using static or absolute positioning, tooltip may overflow viewport

**Wrong:**
```vue
<InTooltipV2 :dynamic-position="false" static-position="bottom center" />
```

**Correct:**
```vue
<InTooltipV2 :dynamic-position="true" static-position="bottom center" />
```

ℹ️ **Not providing accessible content**

Tooltip content should be descriptive and accessible

**Wrong:**
```vue
<InTooltipV2 tooltip-text="..." />
```

**Correct:**
```vue
<InTooltipV2 tooltip-text="Click to edit user profile" />
```

ℹ️ **Using dynamic positioning for static layouts**

If tooltip target never moves, dynamic positioning is unnecessary overhead

**Wrong:**
```vue
<InTooltipV2 :dynamic-position="true" />  <!-- in static layout -->
```

**Correct:**
```vue
<InTooltipV2 :dynamic-position="false" static-position="top center" />
```

## Best Practices

- **Use Dynamic Positioning for Responsive Layouts:** Enable dynamic positioning when tooltip target may be near viewport edges or in scrollable containers
- **Keep Offset Values Small:** Use small offset values (4-16px) to maintain visual connection between tooltip and target
- **Use Static Positioning for Fixed Layouts:** When tooltip target has fixed position, use static positioning for better performance
- **Provide Clear, Concise Tooltip Text:** Keep tooltip content brief and informative (1-2 sentences max)
- **Enable XSS Protection for User-Generated Content:** Always enable preventXss when displaying user-provided content in tooltips

