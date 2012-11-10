/**
 * Force pull
 */
Game.Pull = function(being, direction) {
	Game.Force.call(this, being, direction, "push", -1, 
					Game.Rules.PULL_FORCE_MIN, Game.Rules.PULL_FORCE_MAX);
}
Game.Pull.extend(Game.Force);
