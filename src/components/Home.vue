<script lang="ts">
import { initInitData, User } from '@tma.js/sdk';
import { TonConnectUI, TonConnectUiOptions } from '@tonconnect/ui';

interface HomeComponentData {
  userInfo: User | undefined | null,
  count: number
}

export default {
  data(): HomeComponentData {
    return {
      userInfo: null,
      count: 0,
    }
  },
  created() {
    this.initData();
  },
  mounted() {
    this.initWallet();
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
    }
  },
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
