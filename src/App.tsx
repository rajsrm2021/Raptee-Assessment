import { useState, useEffect, useRef } from 'react'
import './App.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'


gsap.registerPlugin(ScrollTrigger)
    

const images = Object.values(import.meta.glob('/src/assets/*.jpg', { eager: true })).map((module: any) => module.default)


images.sort()


const textSections = [
    { title: '', description: '', imageIndex: 0 },
    { title: 'BRAKE DISCES', description: 'Breake that stop the bike, but free your mind', imageIndex: 6 },
    { title: 'RADIAL TUBELESS TYRES', description: 'Smoother Rides, Improved Traction, Better High Speeding Handling', imageIndex: 25 },
    { title: 'DUAL CHANNEL ABS', description: 'Ready for any roads, even no roads', imageIndex: 40 },
    { title: 'IP67', description: 'Tested and sealed for life, No matter what, IP67 protection keeps the tiniest speck of dust. Tested and sealed for life, so you can ride without a care!', imageIndex: 60 },
    { title: 'BATTERY MANAGEMENT SYSTEM', description: 'Always on Monitoring - Reimagined', imageIndex: 70 },
    { title: 'POWER DISTRIBUTION SYSTEM', description: 'Precision power, perfectly distributed', imageIndex: 85 },
    { title: '', description: '', imageIndex: 92 },
  
]

function App() {
    const containerRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)
    const currentImageIndex = useRef(0)
    const [currentText, setCurrentText] = useState(textSections[0])

    useEffect(() => {
        if (!containerRef.current || !imageRef.current) return;
    
       
        images.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    
        const updateImageAndText = (index: number) => {
            if (!imageRef.current) return;
    
            const imgIndex = Math.min(Math.floor(index), images.length - 1);
            if (currentImageIndex.current !== imgIndex) {
                imageRef.current.src = images[imgIndex];
                currentImageIndex.current = imgIndex;
    
                let textIndex = 0;
                for (let i = textSections.length - 1; i >= 0; i--) {
                    if (imgIndex >= textSections[i].imageIndex) {
                        textIndex = i;
                        break;
                    }
                }
                setCurrentText(textSections[textIndex]);
            }
        };
    
       
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    
        const animation = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end:  `+=${images.length * 10}px`,
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                onUpdate: (self) => {
                    const imageIndex = self.progress * (images.length - 1);
                    updateImageAndText(imageIndex);
                },
            },
        });
    
        return () => {
            animation.kill();
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);
    

    return (
        <div className='animation-container' ref={containerRef}>
            <div className='content-wrapper'>
                <div className='image-container'>
                    <img ref={imageRef} src={images[0]} alt='Animation frame' className='animation-image' />
                </div>
                <div className='text-content'>
                    <h2>{currentText.title}</h2>
                    <p>{currentText.description}</p>
                </div>
            </div>
        </div>
    )
}

export default App
