
package com.bigboots.ai.triggers;
import com.bigboots.BBWorldManager;
import com.bigboots.physics.BBPhysicsManager;
import com.jme3.bullet.collision.PhysicsCollisionObject;
import com.jme3.bullet.collision.shapes.SphereCollisionShape;
import com.jme3.bullet.control.GhostControl;
import com.jme3.export.JmeExporter;
import com.jme3.export.JmeImporter;
import com.jme3.renderer.RenderManager;
import com.jme3.renderer.ViewPort;
import com.jme3.scene.Spatial;
import com.jme3.scene.control.Control;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;

/**
 * Sphere trigger attached to every autonomous entity, contains command that is
 * executed when entity enters.
 * 
 * @author Vemund Kvam
 * 
 * 
 */
public class SphereTrigger implements TriggerControl {

    protected Spatial spatial;
    protected boolean enabled = true;
    protected GhostControl ghostControl;
    protected float checkTimer = 0;
    protected float checkTime = 1;
    protected BBWorldManager world;

    public SphereTrigger(BBWorldManager world) {
        this.world = world;
    }

    public GhostControl getGhost() {
        return ghostControl;
    }

    public void setGhostRadius(float radius) {
        ghostControl.setCollisionShape(new SphereCollisionShape(radius));
    }

    public void setCheckTime(float checkTime) {
        this.checkTime = checkTime;
    }

    public void update(float tpf) {
        if (!enabled) {
            return;
        }
        checkTimer += tpf;
        if (checkTimer >= checkTime) {
            checkTimer = 0;
/*
                List<PhysicsCollisionObject> objects = ghostControl.getOverlappingObjects();
                for (Iterator<PhysicsCollisionObject> it = objects.iterator(); it.hasNext();) {
                    PhysicsCollisionObject physicsCollisionObject = it.next();
                    Spatial targetEntity = world.getEntity(physicsCollisionObject);
                    if (targetEntity != null && spatial.getUserData("player_id") != targetEntity.getUserData("player_id")) {
                            return;                   
                    }
                }
            */
        }
    }

    public void setSpatial(Spatial spatial) {
        if (spatial == null) {
            if (this.spatial != null) {
                this.spatial.removeControl(ghostControl);
                BBPhysicsManager.getInstance().getPhysicsSpace().remove(ghostControl);
            }
            this.spatial = spatial;
            return;
        }
        this.spatial = spatial;
        if (ghostControl == null) {
            ghostControl = new GhostControl(new SphereCollisionShape(10));
        }
        spatial.addControl(ghostControl);
        BBPhysicsManager.getInstance().getPhysicsSpace().add(ghostControl);
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void render(RenderManager rm, ViewPort vp) {
    }

    public Control cloneForSpatial(Spatial spatial) {
        throw new UnsupportedOperationException("Not supported.");
    }

    public void write(JmeExporter ex) throws IOException {
        throw new UnsupportedOperationException("Not supported.");
    }

    public void read(JmeImporter im) throws IOException {
        throw new UnsupportedOperationException("Not supported.");
    }
}