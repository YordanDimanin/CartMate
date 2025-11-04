import React from 'react';
import { Button, Card } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const Settings = () => {
  return (
    <SafeAreaView>
        <Card>
          <Card.Title title="Card Title" subtitle="Card Subtitle" />
          <Card.Actions>
            <Button>Cancel</Button>
            <Button>Ok</Button>
          </Card.Actions>
        </Card>
      </SafeAreaView>
  )
}

export default Settings;