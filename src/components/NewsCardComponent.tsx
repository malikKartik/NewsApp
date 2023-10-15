import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Animated, {
  Extrapolate,
  FadeInUp,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector, PanGestureHandler} from 'react-native-gesture-handler';

const APressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  pinNews: (title: string, newsToBePinned: News) => void;
  item: News;
  index: number;
  deleteNews: (title: string, newsToBeDeleted: News) => void;
};

const width = Dimensions.get('window').width;

const NewsCardComponent = ({item, index, pinNews, deleteNews}: Props) => {
  const opacity = useSharedValue(0);
  const x = useSharedValue(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const ref = useRef();

  useEffect(() => {
    opacity.value = withTiming(1);
  }, []);

  const pinCard = () => {
    opacity.value = withTiming(0, {}, () => {
      runOnJS(pinNews)(item.title, item);
    });
  };

  const removeCard = () => {
    opacity.value = withTiming(0, {}, () => {
      runOnJS(deleteNews)(item.title, item);
    });
  };

  const rStyles = useAnimatedStyle(() => {
    const height = interpolate(
      opacity.value,
      [1, 0],
      [100, 0],
      Extrapolate.CLAMP,
    );
    // const x = interpolate(opacity.value, [1, 0], [0, -width], Extrapolate.CLAMP);
    return {
      opacity: opacity.value,
      height: height,
      transform: [{translateX: x.value}],
    };
  }, []);

  const backgroundStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      x.value,
      [-1, 1],
      ['red', 'green'],
    );
    return {
      backgroundColor: backgroundColor,
    };
  }, []);

  const pan = Gesture.Pan().failOffsetY([-5,5]).activeOffsetX([-5, 5])
    .onUpdate(e => {
      if (e.translationX > 0) {
        runOnJS(setIsDeleting)(false);
      } else {
        runOnJS(setIsDeleting)(true);
      }
      x.value = e.translationX;
    })
    .onEnd(e => {
      if (x.value > width / 2) {
        x.value = withTiming(width, {}, () => {
          runOnJS(pinCard)();
        });
      } else if (x.value < -width / 2) {
        x.value = withTiming(-width, {}, () => {
          runOnJS(removeCard)();
        });
      } else {
        x.value = withSpring(0);
      }
    });
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slideBackground, backgroundStyles]}>
        <Text style={styles.text}>
          {isDeleting ? 'Deleting...' : 'Pinning...'}
        </Text>
      </Animated.View>
      <GestureDetector gesture={pan}>
        <APressable
          style={[
            styles.innerContainer,
            rStyles,
          ]}>
            <Text>by {item.author}</Text>
          <Text style={[styles.text, {fontWeight: '600'}]}>
            {item.title}
          </Text>
          <Text style={styles.timeText}>
            {item.publishedAt}
          </Text>
          <Text style={styles.publisherText}>
            By {item.author}
          </Text>
        </APressable>
      </GestureDetector>
    </View>
  );
};

export default NewsCardComponent;

const styles = StyleSheet.create({
  container: {
  },
  slideBackground: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    padding: 8,
    backgroundColor: '#141316'
  },
  text: {
    color: '#E7E1F5',
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  timeText: {
    fontSize: 10,
    color: '#E7E1F5',
    fontFamily: 'Roboto',
  },
  publisherText: {
    fontSize: 10,
    color: '#928F99',
    fontFamily: 'Roboto',
  }
});
