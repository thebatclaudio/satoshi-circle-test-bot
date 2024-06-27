<script lang="ts">
import { initInitData, initCloudStorage, CloudStorage, User } from '@tma.js/sdk';
import { TonConnectUI, TonConnectUiOptions } from '@tonconnect/ui';

interface HomeComponentData {
  cloudStorage: CloudStorage | undefined | null,
  userInfo: User | undefined | null,
  count: number,
  countTimeout: ReturnType<typeof setTimeout> | null,
}

export default {
  data(): HomeComponentData {
    return {
      cloudStorage: null,
      userInfo: null,
      count: 0,
      countTimeout: null as ReturnType<typeof setTimeout> | null,
    }
  },
  created() {
    this.initData();
  },
  async mounted() {
    this.initWallet();
    await this.initCloudStorage();
  },
  methods: {
    initData() {
      const data = initInitData()
      if (data !== undefined) {
        this.userInfo = data?.user
      }
    },
    initWallet() {
      const tonConnectUI = new TonConnectUI({
        manifestUrl: 'https://thebatclaudio.github.io/satoshi-circle-test-bot/tonconnect-manifest.json',
        buttonRootId: 'ton-connect-button'
      });

      tonConnectUI.getWallets();

      tonConnectUI.uiOptions = {
        twaReturnUrl: 'https://t.me/SatoshiCircleTestBot'
      } as TonConnectUiOptions;
    },
    async initCloudStorage() {
      this.cloudStorage = initCloudStorage();
      await this.fetchCountFromCloud();
    },
    async saveCountOnCloud(count: number) {
      console.log('saving count:', count);
      if (this.cloudStorage) {
        try {
          await this.cloudStorage.set('satoshi-click-count', count.toString());
          console.log('Count saved successfully');
          // Chiamiamo un metodo separato per recuperare il conteggio
          await this.fetchCountFromCloud();
        } catch (error) {
          console.error('Failed to save satoshi-click-count to CloudStorage:', error);
        }
      }
    },
    async fetchCountFromCloud() {
      console.log('Fetching count from cloud');
      if (this.cloudStorage) {
        try {
          const savedCount = await this.cloudStorage.get('satoshi-click-count');
          console.log('Retrieved count from cloud:', savedCount);
          if (savedCount !== null && savedCount !== undefined) {
            this.count = parseInt(savedCount);
            console.log('Updated local count:', this.count);
          } else {
            console.log('No count found in cloud storage');
          }
        } catch (error) {
          console.error('Failed to get satoshi-click-count from CloudStorage:', error);
        }
      }
    }
  },
  watch: {
    count(newCount: number, oldCount: number) {
      if (newCount > oldCount) {
        if (this.countTimeout) {
          clearTimeout(this.countTimeout);
        }

        this.countTimeout = setTimeout(() => {
          this.saveCountOnCloud(newCount);
        }, 1000);
      }
    }
  }
}
</script>

<template>
  <div class="text-center my-5">
    <p class="text-sn">Ciao, <strong>{{ userInfo?.firstName }}</strong>!</p>
    <button class="bg-red-700 font-bold uppercase font-mono m-5 px-5 py-1 rounded-md" type="button"
      @click="count++">Cliccami</button>
    <p>Hai cliccato <strong>{{ count }}</strong> volte</p>
  </div>

  <hr>

  <div class="text-center my-5">
    <button id="ton-connect-button" type="button"></button>
  </div>
</template>
