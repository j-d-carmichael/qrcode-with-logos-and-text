# qrcode-with-logos-and-text


## Introduction
QRcode-with-logos-and-text is a tool designed to create QR codes with embedded logos and text. It is only designed to work within the web browser.

It builds on the qrcode library, offering enhanced features.

This tool allows you to generate a QR code on a canvas or as an image, with the option to add text below the QR code. It also includes functionality to download the generated file.

## Usage

#### VueJs example with Element Plus component library

```vue

<template>
  <el-row>
    <h4>QR Code</h4>
  </el-row>

  <div class="container mt-6 is-flex is-justify-content-center is-flex-direction-column is-align-items-center">
    
    <!-- START: THIS IS THE INJECTION POINT -->
    <canvas id="canvas"></canvas>
    <!-- END: THIS IS THE INJECTION POINT -->

    <div class="download-button-container">
      <el-dropdown class="download-button">
        <el-button plain round>
          <el-icon size="large">
            <Download/>
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="downloadQrCode('small')">
              Small
            </el-dropdown-item>
            <el-dropdown-item @click="downloadQrCode('medium')">
              Medium
            </el-dropdown-item>
            <el-dropdown-item @click="downloadQrCode('large')">
              Large
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div>
      <el-radio-group v-model="colorOption" class="ml-4" @change="generateQrCode">
        <el-radio value="colour" size="large">Colour</el-radio>
        <el-radio value="b&w" size="large">Black & White</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<style scoped>
  .container {
    border: solid 1px #e5e5e5;
    border-radius: 20px;
    padding: 5px;
    position: relative;

    .download-button-container {
      position: absolute;
      top: -15px;
      width: 100%;
      text-align: center;
    }
  }
</style>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import QrCodeWithLogoText from 'qrcode-with-logos-and-text';
  import logo from '@/assets/logo/logo-400x.png';

  const props = defineProps<{ qrValue: string }>();

  const colorOption = ref<'colour' | 'b&w'>('colour');

  const generateQrCode = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    new QrCodeWithLogoText({
      canvas: canvas,
      content: props.qrValue,
      width: 250,
      nodeQrCodeOptions: {
        color: {
          dark: colorOption.value === 'colour' ? '#ffa116' : '#2d2d2f',
          light: '#ffffff'
        }
      },
      logo: {
        src: logo,
      },
      text: {
        text: 'Scan Me',
        colorHexCode: colorOption.value === 'colour' ? '#e89314' : '#2d2d2f',
        font: '14px Arial',
        positionOffset: 5
      }
    });
  };

  enum DownloadQrCodeSize {
    small = '150',
    medium = '380',
    large = '600',
  }

  const downloadQrCode = (size: 'small' | 'medium' | 'large') => {
    // set the defaults for small, then override as needed
    let textOptions = {
      text: 'Scan Me',
      colorHexCode: colorOption.value === 'colour' ? '#e89314' : '#2d2d2f',
      font: '11px Arial',
      positionOffset: 2
    };
    let width = 180;
    switch (size) {
      case 'medium': {
        textOptions.font = '22px Arial';
        textOptions.positionOffset = 12;
        width = 300;
      }
        break;
      case 'large': {
        textOptions.font = '35px Arial';
        textOptions.positionOffset = 20;
        width = 500;
      }
    }
    const qrcode = new QrCodeWithLogoText({
      content: props.qrValue,
      width,
      nodeQrCodeOptions: {
        color: {
          dark: colorOption.value === 'colour' ? '#ffa116' : '#2d2d2f',
          light: '#ffffff'
        }
      },
      logo: {
        src: logo,
      },
      text: textOptions
    });
    qrcode.getImage().then(() => {
      qrcode.downloadImage('Scan-Me-QR-Code');
    });
  };

  onMounted(() => {
    generateQrCode();
  });
</script>

```

## Options

See the BaseOptions for what you can do, also see the npm qrcode for more.


