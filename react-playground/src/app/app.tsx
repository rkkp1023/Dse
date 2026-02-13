// Uncomment this line to use CSS modules
// import styles from './app.module.scss';
import { Button, Color } from '@rkkp1023/react';
import { Select } from '@rkkp1023/react';
import { Spacing } from '@rkkp1023/foundation';

const options = [
  { label: 'OptionA', value: 'A' },
  { label: 'OptionB', value: 'B' },
  { label: 'OptionC', value: 'C' },
  { label: 'OptionD', value: 'D' },
];

export function App() {
  const optionSelected = (option: any, optionIndex: number) => {
    console.log('[React Playground] Option selected: ', option, optionIndex);
  };
  return (
    <div>
      we are up and runningssss
      <Button label="Hello i am button"></Button>
      <Color hexCode="#000" height={Spacing.lg} width={Spacing.lg}></Color>
      <div style={{ padding: '40px' }}>
        <Select
          label="Please select an option..."
          options={options}
          onOptionSelect={optionSelected}
        />
      </div>
    </div>
  );
}

export default App;
