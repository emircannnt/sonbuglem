import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';

const WEB_ASSETS = {
    // Main
    'index.html': require('./assets/web/index.html'),
    'logo.png': require('./assets/web/logo.png'),
    'css/style.css': require('./assets/web/css/style.css'),

    // JS Files (Standard)
    'js/app.js': require('./assets/web/js/app.js'),
    'js/data.js': require('./assets/web/js/data.js'),
    'js/hadith-data.js': require('./assets/web/js/hadith-data.js'),
    'js/html2canvas.min.js': require('./assets/web/js/html2canvas.min.js'),
    'js/logo-data.js': require('./assets/web/js/logo-data.js'),
    'js/prayers.js': require('./assets/web/js/prayers.js'),
    'js/quran.js': require('./assets/web/js/quran.js'),
    'js/sadaka.js': require('./assets/web/js/sadaka.js'),
    'js/stories.js': require('./assets/web/js/stories.js'),

    // Large JS Files (Treated as TXT to avoid bundling overhead)
    // We map from .txt (asset) -> to .js (destination)
    'js/quran-data.js': require('./assets/web/js/quran-data.js.txt'),
    'js/transliteration-data.js': require('./assets/web/js/transliteration-data.js.txt'),
};

export default function App() {
    const [indexUri, setIndexUri] = useState(null);
    const webViewRef = React.useRef(null);

    useEffect(() => {
        async function setupWebEnvironment() {
            try {
                const baseDir = FileSystem.cacheDirectory + 'website/';
                await FileSystem.makeDirectoryAsync(baseDir, { intermediates: true });
                await FileSystem.makeDirectoryAsync(baseDir + 'css/', { intermediates: true });
                await FileSystem.makeDirectoryAsync(baseDir + 'js/', { intermediates: true });

                const promises = Object.keys(WEB_ASSETS).map(async (destPath) => {
                    const asset = Asset.fromModule(WEB_ASSETS[destPath]);
                    await asset.downloadAsync();

                    const targetUri = baseDir + destPath;
                    await FileSystem.copyAsync({
                        from: asset.localUri,
                        to: targetUri
                    });
                });

                await Promise.all(promises);
                setIndexUri(baseDir + 'index.html');
            } catch (e) {
                console.warn('Error setting up web environment:', e);
            }
        }
        setupWebEnvironment();

        const backAction = () => {
            if (webViewRef.current) {
                webViewRef.current.goBack();
                return true;
            }
            return false;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, []);

    if (!indexUri) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#d4af37" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <WebView
                ref={webViewRef}
                source={{ uri: indexUri }}
                style={styles.webview}
                originWhitelist={['*']}
                allowFileAccess={true}
                allowUniversalAccessFromFileURLs={true}
                allowFileAccessFromFileURLs={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                mixedContentMode="always"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
        marginTop: Constants.statusBarHeight,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0a0a0a',
    },
    webview: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    }
});
