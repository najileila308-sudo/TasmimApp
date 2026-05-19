import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const floatY = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslate = useRef(new Animated.Value(20)).current;
  const particleValues = useRef(
    Array.from({ length: 12 }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(0.18 + Math.random() * 0.45),
      scale: new Animated.Value(0.7 + Math.random() * 0.5),
    }))
  ).current;
  const topGlowY = useRef(new Animated.Value(0)).current;
  const bottomGlowY = useRef(new Animated.Value(0)).current;
  const ballScale = useRef(new Animated.Value(1)).current;
  const ballOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();

    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 3000);

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: -12,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(topGlowY, {
          toValue: 10,
          duration: 3200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(topGlowY, {
          toValue: -8,
          duration: 3200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bottomGlowY, {
          toValue: -10,
          duration: 3600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bottomGlowY, {
          toValue: 8,
          duration: 3600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    particleValues.forEach((particle, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(particle.x, {
              toValue: (index % 2 === 0 ? 1 : -1) * (10 + index * 1.6),
              duration: 2200 + index * 120,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(particle.y, {
              toValue: (index % 3 === 0 ? -1 : 1) * (12 + index),
              duration: 2400 + index * 100,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: 0.35 + (index % 4) * 0.1,
              duration: 1800 + index * 100,
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: 1 + (index % 3) * 0.18,
              duration: 1900 + index * 120,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(particle.x, {
              toValue: 0,
              duration: 2200 + index * 120,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(particle.y, {
              toValue: 0,
              duration: 2400 + index * 100,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: 0.16 + (index % 3) * 0.08,
              duration: 1800 + index * 100,
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: 0.75 + (index % 2) * 0.12,
              duration: 1900 + index * 120,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    });

    return () => clearTimeout(buttonTimer);
  }, [bottomGlowY, fadeIn, floatY, particleValues, topGlowY]);

  useEffect(() => {
    if (!showButton) {
      return;
    }

    Animated.parallel([
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 360,
        useNativeDriver: true,
      }),
      Animated.timing(buttonTranslate, {
        toValue: 0,
        duration: 360,
        useNativeDriver: true,
      }),
    ]).start();
  }, [buttonOpacity, buttonTranslate, showButton]);

  const handleStart = () => {
    if (isTransitioning) {
      return;
    }

    setIsTransitioning(true);

    Animated.parallel([
      Animated.timing(ballScale, {
        toValue: 2.8,
        duration: 650,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(ballOpacity, {
        toValue: 0,
        duration: 650,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeIn, {
        toValue: 0,
        duration: 650,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push('/auth');
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      <Animated.View
        style={[styles.backgroundGlowTop, { transform: [{ translateY: topGlowY }] }]}
      />
      <Animated.View
        style={[styles.backgroundGlowBottom, { transform: [{ translateY: bottomGlowY }] }]}
      />

      <Animated.View style={[styles.container, { opacity: fadeIn }]}>
        <View style={styles.topSpacer} />

        <Animated.View
          style={[
            styles.ballZone,
            {
              opacity: ballOpacity,
              transform: [{ translateY: floatY }, { scale: ballScale }],
            },
          ]}>
          {PARTICLES.map((particle, index) => {
            const animated = particleValues[index];

            return (
              <Animated.View
                key={particle.id}
                style={[
                  styles.particle,
                  {
                    width: particle.size,
                    height: particle.size,
                    top: particle.top,
                    left: particle.left,
                    opacity: animated.opacity,
                    transform: [
                      { translateX: animated.x },
                      { translateY: animated.y },
                      { scale: animated.scale },
                    ],
                  },
                ]}
              />
            );
          })}

          <View style={styles.ballCore}>
            <View style={styles.ballInner}>
              <Image
                source={require('@/assets/images/logotasmim.png')}
                style={styles.ballLogo}
                resizeMode="contain"
              />
            </View>
          </View>
        </Animated.View>

        <View style={styles.textBlock}>
          <Text style={styles.title}>Tasmim.Web</Text>
          <Text style={styles.subtitle}>
            Design digital, web et mobile{'\n'}dans une seule experience.
          </Text>

          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>Bienvenue dans votre espace digital</Text>
          </View>
        </View>

        <Animated.View
          style={[
            styles.buttonWrap,
            {
              opacity: buttonOpacity,
              transform: [{ translateY: buttonTranslate }],
            },
          ]}>
          {showButton ? (
            <Pressable
              style={({ pressed }) => [
                styles.startBtn,
                pressed && { opacity: 0.88 },
                isTransitioning && { opacity: 0.7 },
              ]}
              onPress={handleStart}
              disabled={isTransitioning}>
              <Text style={styles.startBtnText}>Commencer</Text>
              <View style={styles.startArrow}>
                <Text style={styles.startArrowText}>{'>'}</Text>
              </View>
            </Pressable>
          ) : (
            <View style={styles.loaderWrap}>
              <ActivityIndicator color={WHITE} />
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const BG = '#061E49';
const ACCENT = '#3B82F6';
const ACCENT2 = '#69A8FF';
const WHITE = '#FFFFFF';
const PARTICLES = [
  { id: 'p1', top: 24, left: 42, size: 6 },
  { id: 'p2', top: 36, left: 194, size: 5 },
  { id: 'p3', top: 70, left: 16, size: 4 },
  { id: 'p4', top: 82, left: 224, size: 7 },
  { id: 'p5', top: 122, left: 30, size: 5 },
  { id: 'p6', top: 138, left: 214, size: 4 },
  { id: 'p7', top: 176, left: 12, size: 6 },
  { id: 'p8', top: 192, left: 236, size: 5 },
  { id: 'p9', top: 222, left: 60, size: 4 },
  { id: 'p10', top: 236, left: 176, size: 6 },
  { id: 'p11', top: 102, left: 100, size: 4 },
  { id: 'p12', top: 208, left: 114, size: 5 },
] as const;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
    overflow: 'hidden',
  },
  backgroundGlowTop: {
    position: 'absolute',
    top: -90,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: 'rgba(74, 144, 255, 0.18)',
  },
  backgroundGlowBottom: {
    position: 'absolute',
    bottom: 70,
    left: -70,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: 'rgba(109, 168, 255, 0.16)',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingBottom: 48,
    paddingHorizontal: 28,
  },
  topSpacer: {
    height: 40,
  },
  ballZone: {
    width: 270,
    height: 270,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  particle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    shadowColor: '#A9D4FF',
    shadowOpacity: 0.95,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  ballCore: {
    width: 126,
    height: 126,
    borderRadius: 63,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ACCENT,
    shadowOpacity: 0.28,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  ballInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ballLogo: {
    width: 68,
    height: 68,
  },
  textBlock: {
    alignItems: 'center',
    gap: 10,
  },
  title: {
    color: WHITE,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -0.7,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginTop: 6,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
  badgeText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '600',
  },
  buttonWrap: {
    width: '100%',
    minHeight: 70,
    justifyContent: 'center',
  },
  loaderWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: ACCENT2,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 48,
    width: '100%',
    shadowColor: ACCENT,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  startBtnText: {
    color: WHITE,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  startArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startArrowText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '800',
  },
});
