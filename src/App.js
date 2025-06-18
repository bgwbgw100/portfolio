import React, { Suspense, useState, useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Stars } from '@react-three/drei';
import './App.css';

function ImagePlane({ imageUrl, position, rotation }) {
  const texture = useLoader(TextureLoader, imageUrl);
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent={true} />
    </mesh>
  );
}

// Wall 컴포넌트 추가
function Wall({ position, args }) {
  return (
    <mesh position={position}>
      <boxGeometry args={args} />
      <meshBasicMaterial color="gray" />
    </mesh>
  );
}

// Star 컴포넌트 추가
function Circle({ position }) {
  return (
    <mesh position={position}>
      <circleGeometry args={[0.1, 100, 0]} />
      <meshBasicMaterial color="yellow" />
    </mesh>
  );
}

function App() {
  const [planePosition, setPlanePosition] = useState([0, 0, -2]);
  const [planeXSpeed, setPlaneXSpeed] = useState(0);
  const [planeYSpeed, setPlaneYSpeed] = useState(0);
  const [planeImage, setPlaneImage]= useState('/냠냠.png')
  const [planeRotation, setPlaneRotation] = useState([0, 0, 0]);
  const [clear, setClear] = useState(false);
  const [circle, setCircle] = useState([
    {
      position: [1, 0, 0],
      eat: false,
    },
    {
      position: [2, 0, 0],
      eat: false,
    },
    {
      position: [3, 0, 0],
      eat: false,
    }
  ]);

  const wallPosition = {
    top: [0, 5, -2],
    bottom: [0, -5, -2],
    left: [-5, 0, -2],
    right: [5, 0, -2],
  }
  const wallArgs ={
    top: [10, 0.03, 0.03],
    bottom: [10, 0.03, 0.03],
    left: [0.03, 10, 0.03],
    right: [0.03, 10, 0.03],
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      // 위치 업데이트는 setInterval에서 처리하므로 여기서는 속도만 변경
      switch (event.key) {
        case 'ArrowUp':
          setPlaneYSpeed((prevSpeed) => {
            setPlaneXSpeed((prevSpeed) => 0)
            return 0.1; // 속도 변화량 조정
          })  
          setPlaneRotation((prevRotation) => {
            return [0, 0, Math.PI / 2];
          })
          break;
        case 'ArrowDown':
          setPlaneYSpeed((prevSpeed) => {
            setPlaneXSpeed((prevSpeed) => 0)
            return -0.1; // 속도 변화량 조정
          })  
          setPlaneRotation((prevRotation) => {
            return [0, 0, -Math.PI / 2 ];
          })
          break;
        case 'ArrowLeft':
          setPlaneXSpeed((prevSpeed) => {
            setPlaneYSpeed((prevSpeed) => 0)
            return -0.1; // 속도 변화량 조정
          });
          setPlaneRotation((prevRotation) => {
            return [0, 0, Math.PI ];
          })
          break;
        case 'ArrowRight':
          setPlaneXSpeed((prevSpeed) => {
            setPlaneYSpeed((prevSpeed) => 0)
            return 0.1;
        
          });
          setPlaneRotation((prevRotation) => {
            return [0, 0, 0];
          })
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // setInterval을 사용하여 planePosition 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setPlanePosition((prevPosition) => {
        // 벽에 닿으면 멈춤
        if (prevPosition[0] < -4.5  ) {
          if(planeXSpeed < 0){
            return prevPosition;
          }
        }
        if (prevPosition[0] > 4.5  ) {
          if(planeXSpeed > 0){
            return prevPosition;
          }
        }
        if (prevPosition[1] < -4.5  ) {
          if(planeYSpeed < 0){
            return prevPosition;
          }
        }
        if (prevPosition[1] > 4.5  ) {
          if(planeYSpeed > 0){
            return prevPosition;
          }
        }
        // 팩맨이 먹은경우 
        setCircle((prevCircle) => {
          
          prevCircle.map((circle, index) => {
            const deltaX = circle.position[0] - prevPosition[0];
            const deltaY = circle.position[1] - prevPosition[1];
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if(distance < 0.1) {
              prevCircle[index].eat = true;
              prevCircle[index].position = "";
            }
          })
          
          return [...prevCircle];
        })

        // 모든 별이 먹혔는지 확인
        const allEaten = circle.every((circle) => circle.eat);
        if (allEaten) {
          setClear((prev)=>{
            if(prev){
              return prev;
            }
            alert("clear!")
            return true;
          });
        }
       
        
        // 방향에따라 포지션 변경
        const newPosition = [...prevPosition];
        newPosition[0] += planeXSpeed; // X축으로 속도만큼 이동
        newPosition[1] += planeYSpeed; // Y축으로 속도만큼 이동
        return newPosition;
      });
    }, 1000 / 60); // 약 60fps로 업데이트 (초당 60번)

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 해제
  }, [planeXSpeed, planeYSpeed]); // planeSpeed가 변경될 때마다 setInterval이 재설정되도록 의존성 배열에 추가

  useEffect(() => {
    setTimeout(() => {
      setPlaneImage((prevImage) => {
        if (prevImage === '/냠냠.png') {
          return '/냠냠2.png';
        } else {
          return '/냠냠.png';
        }
      })
    }, 1000);
  }, [planeImage]);
    
  return (
    <div id="canvas-container">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <ImagePlane imageUrl={planeImage} position={planePosition} rotation={planeRotation}/>
        </Suspense>
        {/* 벽 추가 */}
        <Wall position={wallPosition.top} args={wallArgs.top} /> {/* 위쪽 벽 */}
        <Wall position={wallPosition.bottom} args={wallArgs.bottom} /> {/* 아래쪽 벽 */}
        <Wall position={wallPosition.left} args={wallArgs.left} /> {/* 왼쪽 벽 */}
        <Wall position={wallPosition.right} args={wallArgs.right} /> {/* 오른쪽 벽 */}

        {circle.map((circle, index) => {
          if(circle.position){
            return (<Circle key={index} position={circle.position} />)
          }
        })}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      </Canvas>
    </div>
  );
}

export default App;
