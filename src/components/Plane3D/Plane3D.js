import { useEffect, useRef } from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {BufferAttribute} from "three";

const Plane3D = () => {

    const mount = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 60 )
        const renderer = new THREE.WebGLRenderer({alpha: true})
        const controls = new OrbitControls(camera, renderer.domElement);

        scene.fog = new THREE.Fog(0xF2F5F9, 1,50)
        camera.position.set(0,5,20)
        renderer.setSize( window.innerWidth, window.innerHeight );

        const light = new THREE.AmbientLight( 0x404040, 4 ); // soft white light
        scene.add( light );

        mount.current.appendChild( renderer.domElement );

        const geometry = new THREE.PlaneGeometry(100, 50, 40, 20);

        geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( geometry.attributes.position.count * 3 ), 3 ) );

        const material = new THREE.MeshBasicMaterial( {
            color: 0xffffff,
        } );

        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true,
            side: THREE.DoubleSide
        });

        // const texture = new THREE.TextureLoader().load( 'textures/sea.png' );
        //
        // const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
        //
        // texture.anisotropy = maxAnisotropy;
        //
        // console.log(THREE.MirroredRepeatWrapping)
        //
        // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        // texture.repeat.set( 20,10 );
        //
        // const material = new THREE.MeshLambertMaterial({
        //     color: new THREE.Color(0xffffff),
        //     map: texture
        // });


        const plane = new THREE.Mesh(geometry, material);
        plane.add(new THREE.Mesh(geometry, wireframeMaterial))

        plane.rotateX(-1.571)

        console.log(plane)

        scene.add(plane);

        let count = 0;
        const AMOUNTX = 40;
        const AMOUNTY = 80;

        document.addEventListener('click', (e)=>{
            console.log(camera)
        })

        const argCount = 0.007;

        const randPoints = getArrayRandomSegments(AMOUNTX, AMOUNTY, 3000);

        let wave = () => {
            const positions = plane.geometry.attributes.position.array;
            let i = 0, j = 0;

            for (let ix = 0; ix < AMOUNTX; ix++) {
                for (let iy = 0; iy < AMOUNTY; iy++) {
                    if(j < randPoints.length){
                        if(ix == randPoints[j][0] && iy == randPoints[j][1]){
                            positions[i+2] = (
                                Math.cos(((j + 1 - count) + 0.5) )
                            ) + (
                                Math.cos(((j + 1 - count) + 0.5) )
                            ) * 2;

                            j++;
                        }
                    }
                    i += 3;
                }
            }

            plane.geometry.attributes.position.needsUpdate = true;
            count += argCount;
        }

        const animate = function () {
            requestAnimationFrame( animate );
            renderer.render( scene, camera );

            wave();
        }

        const onWindowResize = function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );
        }

        window.addEventListener("resize", onWindowResize, false);

        animate();

        function getArrayRandomSegments (amountx,amounty, count = false){
            let arr = Array();
            count = (count === false?Math.floor(Math.random() * amountx * amounty):count);

            for (let i = 0; i < count; i++){
                arr.push([Math.floor(Math.random() * amountx), Math.floor(Math.random() * amounty)])
            }

            arr = arr.sort((firstEl, secondEl)=>{
                if(firstEl[0] > secondEl[0]){
                    return 1;
                }
                if(firstEl[0] < secondEl[0]){
                    return -1;
                }
                if(firstEl[0] == secondEl[0]){
                    if(firstEl[1] > secondEl[1]){
                        return 1;
                    }
                    if(firstEl[1] < secondEl[1]){
                        return -1;
                    }
                    return 0
                }

            })

            arr = arr.map((item, i, arr)=>{
                if(i < 1)
                    return item
                if(item[0] != arr[i-1][0] || item[1] != arr[i-1][1]){
                    return item;
                }
            }).filter((item)=> item != undefined)

            return arr;
        }

        return () => mount.current.removeChild( renderer.domElement);
    }, []);

    return (
        <div ref={mount}>

        </div>
    );
}

export default Plane3D;