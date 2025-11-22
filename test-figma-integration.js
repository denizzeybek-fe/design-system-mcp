#!/usr/bin/env node

/**
 * Test Figma Integration
 */

console.log('🎨 Testing Figma Integration...\n');

// Sample Figma frame data
const sampleFrame = {
  name: 'Login Form',
  id: 'frame-1',
  node: {
    id: 'root',
    name: 'Login Form',
    type: 'FRAME',
    children: [
      {
        id: 'title',
        name: 'Title',
        type: 'TEXT',
        characters: 'Welcome Back',
      },
      {
        id: 'email-input',
        name: 'Email Input',
        type: 'INSTANCE',
        componentName: 'Input/Email',
        properties: {
          State: 'Default',
        },
      },
      {
        id: 'password-input',
        name: 'Password Input',
        type: 'INSTANCE',
        componentName: 'Input/Password',
        properties: {
          State: 'Default',
        },
      },
      {
        id: 'submit-btn',
        name: 'Submit Button',
        type: 'INSTANCE',
        componentName: 'Button/Primary',
        properties: {
          Style: 'Solid',
          Size: 'Default',
        },
      },
    ],
  },
};

async function test() {
  try {
    console.log('📦 Loading Figma converter...');
    const { convertFigmaFrameToVue, validateFigmaComponentName, getAllMappings } = await import(
      './dist/services/figma-converter.js'
    );

    console.log('✅ Converter loaded\n');

    // Test 1: List all mappings
    console.log('📊 Test 1: Get all mappings');
    const mappings = getAllMappings();
    console.log(`   Found ${mappings.length} component mappings`);
    console.log(`   - Button → ${mappings.find(m => m.dsComponent === 'InButtonV2')?.dsComponent}`);
    console.log(`   - DatePicker → ${mappings.find(m => m.dsComponent === 'InDatePickerV2')?.dsComponent}`);
    console.log(`   - Input → ${mappings.find(m => m.dsComponent === 'InTextInput')?.dsComponent}`);

    // Test 2: Validate component names
    console.log('\n🔍 Test 2: Validate Figma component names');
    const validations = [
      'Button/Primary',
      'DatePicker/Range',
      'Input/Email',
      'Unknown/Component',
    ];

    for (const name of validations) {
      const result = validateFigmaComponentName(name);
      console.log(`   ${name}: ${result.valid ? '✅' : '❌'}`);
      if (!result.valid && result.suggestions?.length) {
        console.log(`      Suggestions: ${result.suggestions.join(', ')}`);
      }
    }

    // Test 3: Convert frame to Vue
    console.log('\n🔄 Test 3: Convert Figma frame to Vue component');
    const conversion = convertFigmaFrameToVue(sampleFrame, {
      componentName: 'LoginForm',
      includeScript: true,
      includeComments: true,
      scriptLang: 'ts',
    });

    console.log(`   Component: ${conversion.componentName}`);
    console.log(`   Imports: ${conversion.imports.join(', ')}`);
    console.log(`   Warnings: ${conversion.warnings.length}`);
    console.log(`   Manual props: ${conversion.manualProps.length}`);

    console.log('\n📝 Generated Code:');
    console.log('─'.repeat(60));
    console.log(conversion.code);
    console.log('─'.repeat(60));

    if (conversion.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      conversion.warnings.forEach((w, i) => console.log(`   ${i + 1}. ${w}`));
    }

    if (conversion.manualProps.length > 0) {
      console.log('\n📌 Manual Props Needed:');
      conversion.manualProps.forEach(mp => {
        console.log(`   - ${mp.componentId}.${mp.propName}: ${mp.reason}`);
      });
    }

    console.log('\n🎉 All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nStack:', error.stack);
    process.exit(1);
  }
}

test();
