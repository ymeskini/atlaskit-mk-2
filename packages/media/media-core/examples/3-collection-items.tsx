import * as React from 'react';
import { Component } from 'react';
import { Subscription } from 'rxjs/Subscription';
import { Card } from '@atlaskit/media-card';
import Button from '@atlaskit/button';
import { createUserMediaClient } from '@atlaskit/media-test-helpers';
import { FileIdentifier } from '../src';
import { CardsWrapper, Header } from '../example-helpers/styled';

const mediaClient = createUserMediaClient();
const mediaClientConfig = mediaClient.config;
const collectionName = 'recents';
export interface ExampleState {
  fileIds: string[];
}

class Example extends Component<{}, ExampleState> {
  subscription?: Subscription;

  state: ExampleState = {
    fileIds: [],
  };

  componentDidMount() {
    this.getItems();
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  renderCards() {
    const { fileIds } = this.state;
    const cards = fileIds.map(id => {
      const identifier: FileIdentifier = {
        id,
        mediaItemType: 'file',
        collectionName,
      };

      return (
        <Card
          key={id}
          identifier={identifier}
          mediaClientConfig={mediaClientConfig}
          dimensions={{
            width: 100,
            height: 50,
          }}
        />
      );
    });

    return (
      <CardsWrapper>
        <h1>Cards</h1>
        {cards}
      </CardsWrapper>
    );
  }

  getItems = () => {
    this.subscription = mediaClient.collection
      .getItems(collectionName)
      .subscribe({
        next: items => {
          const fileIds = items.map(item => item.id);

          this.setState({
            fileIds,
          });
        },
      });
  };

  fetchNextPage = () => {
    mediaClient.collection.loadNextPage(collectionName);
  };

  getFirstPage = () => {
    // We are intentionally creating a new subscription to simulate "new items" case
    mediaClient.collection.getItems(collectionName).subscribe();
  };

  renderHeader = () => {
    const { fileIds } = this.state;

    return (
      <Header>
        <Button appearance="primary" onClick={this.fetchNextPage}>
          Fetch next page
        </Button>
        <Button appearance="primary" onClick={this.getFirstPage}>
          Get first page
        </Button>
        Items ({fileIds.length})
      </Header>
    );
  };

  render() {
    return (
      <div>
        {this.renderHeader()}
        {this.renderCards()}
      </div>
    );
  }
}

export default () => (
  <div>
    <Example />
  </div>
);
