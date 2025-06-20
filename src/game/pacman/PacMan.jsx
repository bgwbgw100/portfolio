import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import './pacman.css';
import { ImagePlane } from './ImagePlane';
import { Wall } from './Wall';
import { Circle } from './Circle';
import { useNavigate } from 'react-router-dom';
import './pacman.css';

function PacMan() {
  

  const navigate = useNavigate();
  const [planePosition, setPlanePosition] = useState([0, 0, 0]);
  const [planeXSpeed, setPlaneXSpeed] = useState(0);
  const [planeYSpeed, setPlaneYSpeed] = useState(0);
  const [planeImage, setPlaneImage]= useState('/냠냠.png')
  const [planeRotation, setPlaneRotation] = useState([0, 0, 0]);
  const [clear, setClear] = useState(false);
  const [loding, setLoding] = useState(0);
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
    top: [0, 5, 0],
    bottom: [0, -5, 0],
    left: [-5, 0, 0],
    right: [5, 0, 0],
  }
  const maxPosition = {
    topLeft: [-4.5, 4.5],
    bottomLeft: [-4.5, -4.5],
    topRight: [4.5, 4.5],
    bottomRight: [4.5, -4.5],
  }
  const wallArgs ={
    top: [10, 0.03, 0],
    bottom: [10, 0.03, 0],
    left: [0.03, 10, 0],
    right: [0.03, 10, 0],
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
      let minDistance = Number.MAX_VALUE; // 로딩을 위한 circle의 최소 거리
      let minPosition = [];  // 로딩을 위한 최소 거리circle의 포지션
      let pacManCicleDistance=Number.MAX_VALUE; // 팩맨과 circle의 최소 거리
  
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
        // 최소 거리 계산
        // circle.map((circle, index) => {
        //   const deltaX = circle.position[0] - prevPosition[0];
        //   const deltaY = circle.position[1] - prevPosition[1];
        //   const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // })
        // 팩맨이 먹은경우 
        setCircle((prevCircle) => {
          
          prevCircle.map((circle, index) => {
            const deltaX = circle.position[0] - prevPosition[0];
            const deltaY = circle.position[1] - prevPosition[1];
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            
         
            if(distance < 0.3) {
              prevCircle[index].eat = true;
              prevCircle[index].position = "";
            }
          })
          
          return [...prevCircle];
        })
        circle.map((circle, index) => {
          if(circle.eat){
            return;
          }
          const deltaX = circle.position[0] - prevPosition[0];
          const deltaY = circle.position[1] - prevPosition[1];
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          
          pacManCicleDistance = Math.min(distance, pacManCicleDistance); 
          if(distance < minDistance){
            minDistance = distance;
            minPosition = circle.position;
          }
        })


        // 모든 별이 먹혔는지 확인
        const allEaten = circle.every((circle) => circle.eat);
        if (allEaten) {
          setClear((prev)=>{

            if(prev){
              alert("clear")  
              navigate("/main")
                return prev;
            }
            return true;
          });
        }

        //거리에따른 로딩
        let circleSize = circle.length;
        
        circle.map((circle, index) => {
          if(circle.eat){
            circleSize--;
          }
        })
        const maxLoding = 100/circleSize;
        
        const max = (circleSize/100) 
        const minX = minPosition[0];
        const minY = minPosition[1];
        let maxLan = -1;
        Object.values(maxPosition).map((wall, index) => {
          const maxX = wall[0];
          const maxY = wall[1];
          const lenX = maxX-minX;
          const lenY = maxY-minY;
          console.table({maxX,maxY,minX,minY})
          const lan = Math.sqrt(lenX * lenX + lenY * lenY);
          if(maxLan < lan){
            maxLan = lan;
          }
        })
        
        console.table({maxLan,pacManCicleDistance})
        const loding =Math.floor( (1-pacManCicleDistance/maxLan) * maxLoding); 
        
        setLoding(()=>loding);
        
        // 방향에따라 포지션 변경
        const newPosition = [...prevPosition];
        newPosition[0] += planeXSpeed; // X축으로 속도만큼 이동
        newPosition[1] += planeYSpeed; // Y축으로 속도만큼 이동
        return newPosition;
      });
    }, 1000 / 30); // 약 60fps로 업데이트 (초당 60번)

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
      <div className="loding">{loding}</div>
      <Canvas camera={{position:[0, 0, 8]}}>
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

export default PacMan;
